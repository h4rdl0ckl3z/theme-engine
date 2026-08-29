"use client";

import { useState, useTransition } from "react";
import { activateTheme, deleteTheme } from "./actions";
import { ThemeEditForm } from "./theme-edit-form";
import type { ThemeConfig } from "@/db/schema";

interface ThemeItem {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  config: ThemeConfig;
  activeVersionId: string | null;
}

export function AdminThemeList({
  themes,
}: {
  themes: ThemeItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleActivate(slug: string) {
    startTransition(async () => {
      await activateTheme(slug);
    });
  }

  function handleDelete(id: string, name: string) {
    if (!confirm(`Delete theme "${name}"?`)) return;
    startTransition(async () => {
      await deleteTheme(id);
    });
  }

  return (
    <div className="space-y-3">
      {themes.map((theme) => (
        <div key={theme.id} className="rounded-md border border-border">
          {/* Theme row */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {/* Color swatches */}
              <div className="flex gap-1">
                <span
                  className="inline-block h-5 w-5 rounded-full border border-border"
                  style={{
                    backgroundColor: `hsl(${theme.config.colors.primary})`,
                  }}
                />
                <span
                  className="inline-block h-5 w-5 rounded-full border border-border"
                  style={{
                    backgroundColor: `hsl(${theme.config.colors.secondary})`,
                  }}
                />
                <span
                  className="inline-block h-5 w-5 rounded-full border border-border"
                  style={{
                    backgroundColor: `hsl(${theme.config.colors.accent})`,
                  }}
                />
              </div>
              <div>
                <div className="font-medium">{theme.name}</div>
                <div className="text-xs text-muted-foreground">{theme.slug}</div>
              </div>
              {theme.isActive && (
                <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  Active
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setEditingId(editingId === theme.id ? null : theme.id)
                }
                disabled={isPending}
                className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
              >
                {editingId === theme.id ? "Close" : "Edit"}
              </button>
              {!theme.isActive && (
                <button
                  onClick={() => handleActivate(theme.slug)}
                  disabled={isPending}
                  className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Activate
                </button>
              )}
              {!theme.isActive && (
                <button
                  onClick={() => handleDelete(theme.id, theme.name)}
                  disabled={isPending}
                  className="rounded-md border border-destructive px-3 py-1.5 text-sm text-destructive hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>

          {/* Inline edit form */}
          {editingId === theme.id && (
            <div className="px-4 pb-4">
              <ThemeEditForm
                themeId={theme.id}
                initialName={theme.name}
                initialConfig={theme.config}
                initialActiveVersionId={theme.activeVersionId}
                onCancel={() => setEditingId(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
