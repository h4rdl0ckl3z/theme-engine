/**
 * Migration to backfill card and cardForeground into existing theme configs.
 *
 * Usage: npx tsx src/db/migrate-card-colors.ts
 */
import { sql } from "drizzle-orm";
import { db } from "./index";
import { themes } from "./schema";
import type { ThemeConfig } from "./schema";

async function migrate() {
  console.log("🔄 Backfilling card colors...");

  const allThemes = await db.query.themes.findMany();

  for (const theme of allThemes) {
    const config = theme.config as ThemeConfig;

    // Skip if card is already set
    if (config.colors?.card) {
      console.log(`  ⏭️  "${theme.name}" already has card colors, skipping.`);
      continue;
    }

    // Add card colors (same as background by default)
    config.colors.card = config.colors.background;
    config.colors.cardForeground = config.colors.foreground;

    await db
      .update(themes)
      .set({ config, updatedAt: new Date() })
      .where(sql`${themes.id} = ${theme.id}`);

    console.log(`  ✅ Backfilled card colors for "${theme.name}"`);
  }

  console.log("\n✨ Migration complete!");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
