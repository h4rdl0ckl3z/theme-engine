import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { themes, themeVersions, type ThemeConfig } from "@/db/schema";
import { builtInThemes } from "./registry";

/**
 * Get the active theme from the database.
 * Resolves config from the active version in theme_versions.
 * Falls back to the default built-in theme if DB is unavailable.
 */
export async function getActiveTheme(): Promise<{
  id: string;
  slug: string;
  name: string;
  config: ThemeConfig;
}> {
  try {
    const active = await db.query.themes.findFirst({
      where: eq(themes.isActive, true),
    });

    if (active) {
      return {
        id: active.id,
        slug: active.slug,
        name: active.name,
        config: active.config as ThemeConfig,
      };
    }
  } catch {
    // Database not available yet
  }

  const fallback = builtInThemes.default;
  return {
    id: "fallback",
    slug: fallback.id,
    name: fallback.name,
    config: fallback.config,
  };
}

/**
 * Get all themes from the database.
 * Falls back to built-in themes if DB is unavailable.
 */
export async function getAllThemes() {
  try {
    const dbThemes = await db.query.themes.findMany({
      orderBy: (themes, { desc }) => [desc(themes.createdAt)],
    });

    if (dbThemes.length > 0) {
      return dbThemes;
    }
  } catch {
    // Database not available yet
  }

  return Object.values(builtInThemes).map((t) => ({
    id: t.id,
    slug: t.id,
    name: t.name,
    config: t.config,
    isActive: t.id === "default",
    activeVersionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
}

/**
 * Get a theme by its slug.
 */
export async function getThemeBySlug(slug: string) {
  try {
    return await db.query.themes.findFirst({
      where: (themes, { eq }) => eq(themes.slug, slug),
    });
  } catch {
    return undefined;
  }
}

/**
 * Get all versions for a theme, ordered newest first.
 */
export async function getThemeVersions(themeId: string) {
  try {
    return await db.query.themeVersions.findMany({
      where: eq(themeVersions.themeId, themeId),
      orderBy: [desc(themeVersions.version)],
    });
  } catch {
    return [];
  }
}
