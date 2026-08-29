"use server";

import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { themes, themeVersions, type ThemeConfig } from "@/db/schema";

/**
 * Activate a theme by its slug.
 * Deactivates all other themes first.
 */
export async function activateTheme(slug: string) {
  await db.update(themes).set({ isActive: false });
  await db
    .update(themes)
    .set({ isActive: true, updatedAt: new Date() })
    .where(eq(themes.slug, slug));

  revalidatePath("/", "layout");
}

/**
 * Save a new version for a theme.
 * Creates a new version row, updates themes.config (denormalized), and sets activeVersionId.
 */
export async function saveThemeVersion(
  themeId: string,
  config: ThemeConfig,
  note?: string
) {
  const theme = await db.query.themes.findFirst({
    where: eq(themes.id, themeId),
  });

  if (!theme) throw new Error("Theme not found.");

  const latestVersion = await db.query.themeVersions.findFirst({
    where: eq(themeVersions.themeId, themeId),
    orderBy: [desc(themeVersions.version)],
  });

  const nextVersion = (latestVersion?.version ?? 0) + 1;

  const [newVersion] = await db
    .insert(themeVersions)
    .values({
      themeId,
      version: nextVersion,
      config,
      note: note || null,
    })
    .returning();

  await db
    .update(themes)
    .set({
      config,
      activeVersionId: newVersion.id,
      updatedAt: new Date(),
    })
    .where(eq(themes.id, themeId));

  revalidatePath("/", "layout");
  return newVersion;
}

/**
 * Rollback a theme to a previous version.
 * Copies that version's config into themes.config and sets it as active.
 */
export async function rollbackToVersion(themeId: string, versionId: string) {
  const version = await db.query.themeVersions.findFirst({
    where: eq(themeVersions.id, versionId),
  });

  if (!version) throw new Error("Version not found.");

  await db
    .update(themes)
    .set({
      config: version.config as ThemeConfig,
      activeVersionId: versionId,
      updatedAt: new Date(),
    })
    .where(eq(themes.id, themeId));

  revalidatePath("/", "layout");
}

/**
 * Delete a theme. Cannot delete the currently active theme.
 */
export async function deleteTheme(id: string) {
  const theme = await db.query.themes.findFirst({
    where: eq(themes.id, id),
  });

  if (theme?.isActive) {
    throw new Error("Cannot delete the currently active theme.");
  }

  await db.delete(themes).where(eq(themes.id, id));

  revalidatePath("/", "layout");
}

/**
 * Create a new theme (with initial version v1).
 */
export async function createTheme(data: {
  slug: string;
  name: string;
  config: ThemeConfig;
}) {
  const [newTheme] = await db
    .insert(themes)
    .values({
      slug: data.slug,
      name: data.name,
      config: data.config,
    })
    .returning();

  const [initialVersion] = await db
    .insert(themeVersions)
    .values({
      themeId: newTheme.id,
      version: 1,
      config: data.config,
      note: "Initial version",
    })
    .returning();

  await db
    .update(themes)
    .set({ activeVersionId: initialVersion.id })
    .where(eq(themes.id, newTheme.id));

  revalidatePath("/", "layout");
}

/**
 * Fetch all versions for a theme (server action for client components).
 */
export async function fetchThemeVersions(themeId: string) {
  try {
    const versions = await db.query.themeVersions.findMany({
      where: eq(themeVersions.themeId, themeId),
      orderBy: [desc(themeVersions.version)],
    });
    return versions.map((v) => ({
      id: v.id,
      themeId: v.themeId,
      version: v.version,
      config: v.config as ThemeConfig,
      note: v.note,
      createdAt: v.createdAt,
    }));
  } catch {
    return [];
  }
}
