/**
 * Migration script to backfill theme_versions for existing themes.
 *
 * Usage: npx tsx src/db/migrate-versions.ts
 */
import { eq, asc } from "drizzle-orm";
import { db } from "./index";
import { themes, themeVersions } from "./schema";
import type { ThemeConfig } from "./schema";

async function migrate() {
  console.log("🔄 Migrating theme versions...");

  const allThemes = await db.query.themes.findMany();

  for (const theme of allThemes) {
    const existingVersions = await db.query.themeVersions.findMany({
      where: eq(themeVersions.themeId, theme.id),
      orderBy: [asc(themeVersions.version)],
    });

    if (existingVersions.length > 0) {
      console.log(`  ⏭️  Theme "${theme.name}" already has ${existingVersions.length} version(s), skipping.`);
      continue;
    }

    // Create initial version from theme's current config
    const [initialVersion] = await db
      .insert(themeVersions)
      .values({
        themeId: theme.id,
        version: 1,
        config: theme.config as ThemeConfig,
        note: "Initial version (migrated)",
      })
      .returning();

    // Link active version
    await db
      .update(themes)
      .set({ activeVersionId: initialVersion.id, updatedAt: new Date() })
      .where(eq(themes.id, theme.id));

    console.log(`  ✅ Created v1 for "${theme.name}"`);
  }

  console.log("\n✨ Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
