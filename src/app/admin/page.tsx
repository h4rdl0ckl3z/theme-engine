import { getAllThemes, getActiveTheme } from "@/themes/queries";
import { AdminThemeList } from "./theme-list";
import { AdminThemeForm } from "./theme-form";
import type { ThemeConfig } from "@/db/schema";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const allThemes = await getAllThemes();
  const activeTheme = await getActiveTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="text-3xl font-bold mb-2">Theme Admin</h1>
        <p className="text-muted-foreground mb-8">
          Manage themes. Changes apply instantly across the site.
        </p>

        <div className="grid gap-8">
          {/* Current theme indicator */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-1">Active Theme</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Currently applied to the entire site
            </p>
            <div className="flex items-center gap-3">
              <span
                className="inline-block h-4 w-4 rounded-full"
                style={{
                  backgroundColor: `hsl(${activeTheme.config.colors.primary})`,
                }}
              />
              <span className="font-medium">{activeTheme.name}</span>
              <span className="text-xs text-muted-foreground">
                ({activeTheme.slug})
              </span>
            </div>
          </section>

          {/* Theme list */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">All Themes</h2>
            <AdminThemeList
              themes={allThemes.map((t) => ({
                id: t.id,
                slug: t.slug,
                name: t.name,
                isActive: t.isActive,
                config: t.config as ThemeConfig,
                activeVersionId: t.activeVersionId ?? null,
              }))}
            />
          </section>

          {/* Create new theme */}
          <section className="rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Create New Theme</h2>
            <AdminThemeForm />
          </section>
        </div>
      </div>
    </div>
  );
}
