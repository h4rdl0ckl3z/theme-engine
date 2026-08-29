/**
 * Seed script to populate the database with built-in themes.
 *
 * Usage: npx tsx src/db/seed.ts
 *
 * Requires DATABASE_URL environment variable to be set.
 */
import { eq } from "drizzle-orm";
import { db } from "./index";
import { themes, themeVersions } from "./schema";
import { builtInThemes } from "../themes/registry";

async function seed() {
  console.log("🌱 Seeding themes...");

  const entries = Object.values(builtInThemes);

  for (const theme of entries) {
    // Check if theme already exists
    const existing = await db.query.themes.findFirst({
      where: eq(themes.slug, theme.id),
    });

    if (existing) {
      console.log(`  ⏭️  Theme "${theme.name}" (${theme.id}) already exists, skipping.`);
      continue;
    }

    // Insert theme
    const [newTheme] = await db
      .insert(themes)
      .values({
        slug: theme.id,
        name: theme.name,
        config: theme.config,
        isActive: theme.id === "default",
      })
      .returning();

    // Create initial version
    const [initialVersion] = await db
      .insert(themeVersions)
      .values({
        themeId: newTheme.id,
        version: 1,
        config: theme.config,
        note: "Initial version",
      })
      .returning();

    // Link active version
    await db
      .update(themes)
      .set({ activeVersionId: initialVersion.id })
      .where(eq(themes.id, newTheme.id));

    console.log(`  ✅ Created theme "${theme.name}" (${theme.id}) with v1`);
  }

  console.log("\n✨ Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
