"use client";

import { useState, useTransition } from "react";
import { createTheme } from "./actions";
import { hexToHsl } from "@/lib/color";
import type { ThemeConfig } from "@/db/schema";

const defaultConfig: ThemeConfig = {
  colors: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",
    primary: "222.2 47.4% 11.2%",
    primaryForeground: "210 40% 98%",
    secondary: "210 40% 96.1%",
    secondaryForeground: "222.2 47.4% 11.2%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
    accent: "210 40% 96.1%",
    accentForeground: "222.2 47.4% 11.2%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 40% 98%",
    border: "214.3 31.8% 91.4%",
    input: "214.3 31.8% 91.4%",
    ring: "222.2 84% 4.9%",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
};

export function AdminThemeForm() {
  const [isPending, startTransition] = useTransition();
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [config, setConfig] = useState<ThemeConfig>(defaultConfig);
  const [message, setMessage] = useState<string | null>(null);

  function updateColor(
    key: keyof ThemeConfig["colors"],
    value: string
  ) {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!slug.trim() || !name.trim()) {
      setMessage("Slug and name are required.");
      return;
    }

    // Validate slug format
    if (!/^[a-z0-9-]+$/.test(slug)) {
      setMessage("Slug must contain only lowercase letters, numbers, and hyphens.");
      return;
    }

    startTransition(async () => {
      try {
        await createTheme({ slug, name, config });
        setMessage(`Theme "${name}" created!`);
        setSlug("");
        setName("");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to create theme.";
        setMessage(message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="rounded-md bg-muted p-3 text-sm">{message}</div>
      )}

      {/* Basic info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-theme"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Lowercase, numbers, and hyphens only
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My Theme"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Color inputs */}
      <div>
        <h3 className="text-sm font-medium mb-3">Colors</h3>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(config.colors) as Array<keyof ThemeConfig["colors"]>).map(
            (key) => (
              <div key={key}>
                <label className="block text-xs text-muted-foreground mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={`hsl(${config.colors[key]})`}
                    onChange={(e) => updateColor(key, hexToHsl(e.target.value))}
                    className="h-8 w-8 cursor-pointer rounded border border-border"
                  />
                  <input
                    type="text"
                    value={config.colors[key]}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="flex-1 rounded border border-input bg-background px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-sm font-medium mb-3">Preview</h3>
        <div
          className="rounded-lg border border-border p-6"
          style={{
            backgroundColor: `hsl(${config.colors.background})`,
            color: `hsl(${config.colors.foreground})`,
          }}
        >
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: `hsl(${config.colors.primary})`,
                color: `hsl(${config.colors.primaryForeground})`,
              }}
            >
              Primary
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: `hsl(${config.colors.secondary})`,
                color: `hsl(${config.colors.secondaryForeground})`,
              }}
            >
              Secondary
            </button>
            <button
              type="button"
              className="rounded-md px-4 py-2 text-sm font-medium"
              style={{
                backgroundColor: `hsl(${config.colors.accent})`,
                color: `hsl(${config.colors.accentForeground})`,
              }}
            >
              Accent
            </button>
          </div>
          <div
            className="rounded-md border p-3 text-sm"
            style={{
              borderColor: `hsl(${config.colors.border})`,
              backgroundColor: `hsl(${config.colors.muted})`,
              color: `hsl(${config.colors.mutedForeground})`,
            }}
          >
            Muted content area
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Creating..." : "Create Theme"}
      </button>
    </form>
  );
}
