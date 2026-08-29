"use client";

import { useState, useEffect, useTransition } from "react";
import { saveThemeVersion, rollbackToVersion, fetchThemeVersions } from "./actions";
import { hexToHsl, hslToHex } from "@/lib/color";
import { availableFonts, getFontById } from "@/themes/fonts";
import type { ThemeConfig } from "@/db/schema";

interface ThemeVersion {
  id: string;
  themeId: string;
  version: number;
  config: ThemeConfig;
  note: string | null;
  createdAt: Date;
}

interface ThemeEditFormProps {
  themeId: string;
  initialName: string;
  initialConfig: ThemeConfig;
  initialActiveVersionId: string | null;
  onCancel: () => void;
}

export function ThemeEditForm({
  themeId,
  initialName,
  initialConfig,
  initialActiveVersionId,
  onCancel,
}: ThemeEditFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [config, setConfig] = useState<ThemeConfig>(initialConfig);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [versions, setVersions] = useState<ThemeVersion[]>([]);
  const [activeVersionId, setActiveVersionId] = useState(initialActiveVersionId);

  // Load version history
  useEffect(() => {
    fetchThemeVersions(themeId).then((v) => {
      setVersions(v as ThemeVersion[]);
    });
  }, [themeId]);

  function updateColor(key: keyof ThemeConfig["colors"], value: string) {
    setConfig((prev) => ({
      ...prev,
      colors: { ...prev.colors, [key]: value },
    }));
  }

  function updateRadius(key: keyof ThemeConfig["radius"], value: string) {
    setConfig((prev) => ({
      ...prev,
      radius: { ...prev.radius, [key]: value },
    }));
  }

  function updateFont(fontId: string) {
    setConfig((prev) => ({
      ...prev,
      typography: { ...prev.typography, fontFamily: fontId },
    }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setMessage("Name is required.");
      return;
    }

    startTransition(async () => {
      try {
        const newVersion = await saveThemeVersion(themeId, config, note || undefined);
        setMessage(`Saved as v${newVersion.version}!`);
        setNote("");
        setActiveVersionId(newVersion.id);

        // Refresh version list
        const updated = await fetchThemeVersions(themeId);
        setVersions(updated as ThemeVersion[]);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to save version.";
        setMessage(message);
      }
    });
  }

  function handleRollback(versionId: string, versionNum: number) {
    if (!confirm(`Rollback to v${versionNum}? This will apply that version's config.`)) return;

    startTransition(async () => {
      try {
        await rollbackToVersion(themeId, versionId);
        setMessage(`Rolled back to v${versionNum}!`);

        // Refresh version list
        const updated = await fetchThemeVersions(themeId);
        setVersions(updated as ThemeVersion[]);

        // Update the preview config to match the rolled-back version
        const rolledVersion = versions.find((v) => v.id === versionId);
        if (rolledVersion) {
          setConfig(rolledVersion.config);
          setActiveVersionId(versionId);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to rollback.";
        setMessage(message);
      }
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-5 pt-4 border-t border-border">
      {message && (
        <div className="rounded-md bg-muted p-3 text-sm">{message}</div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Theme Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Colors */}
      <div>
        <h4 className="text-sm font-medium mb-3">Colors</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(config.colors) as Array<keyof ThemeConfig["colors"]>).map(
            (key) => (
              <div key={key}>
                <label className="block text-xs text-muted-foreground mb-1">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={hslToHex(config.colors[key])}
                    onChange={(e) => updateColor(key, hexToHsl(e.target.value))}
                    className="h-8 w-8 shrink-0 cursor-pointer rounded border border-border"
                  />
                  <input
                    type="text"
                    value={config.colors[key]}
                    onChange={(e) => updateColor(key, e.target.value)}
                    className="flex-1 min-w-0 rounded border border-input bg-background px-2 py-1 text-xs font-mono"
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Radius */}
      <div>
        <h4 className="text-sm font-medium mb-3">Border Radius</h4>
        <div className="flex gap-4">
          {(["sm", "md", "lg"] as const).map((size) => (
            <div key={size} className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground uppercase">
                {size}
              </label>
              <input
                type="text"
                value={config.radius[size]}
                onChange={(e) => updateRadius(size, e.target.value)}
                className="w-20 rounded border border-input bg-background px-2 py-1 text-xs font-mono"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Typography / Font Picker */}
      <div>
        <h4 className="text-sm font-medium mb-3">Typography</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {availableFonts.map((font) => {
            const isSelected = config.typography.fontFamily === font.id;
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => updateFont(font.id)}
                className={`rounded-md border p-3 text-left transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-accent"
                }`}
              >
                <div
                  className="text-lg mb-1 leading-tight"
                  style={{ fontFamily: font.family }}
                >
                  Aa Bb Cc
                </div>
                <div className="text-xs text-muted-foreground">{font.name}</div>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Selected: {getFontById(config.typography.fontFamily)?.name ?? "System UI"}
        </p>
      </div>

      {/* Live Preview */}
      <div>
        <h4 className="text-sm font-medium mb-3">Preview</h4>
        <div
          className="rounded-lg border border-border p-5 transition-colors"
          style={{
            backgroundColor: `hsl(${config.colors.background})`,
            color: `hsl(${config.colors.foreground})`,
            fontFamily: getFontById(config.typography.fontFamily)?.family ?? "system-ui, sans-serif",
          }}
        >
          <div className="flex gap-2 mb-3 flex-wrap">
            <span
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: `hsl(${config.colors.primary})`,
                color: `hsl(${config.colors.primaryForeground})`,
                borderRadius: config.radius.md,
              }}
            >
              Primary
            </span>
            <span
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: `hsl(${config.colors.secondary})`,
                color: `hsl(${config.colors.secondaryForeground})`,
                borderRadius: config.radius.md,
              }}
            >
              Secondary
            </span>
            <span
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: `hsl(${config.colors.accent})`,
                color: `hsl(${config.colors.accentForeground})`,
                borderRadius: config.radius.md,
              }}
            >
              Accent
            </span>
            <span
              className="inline-flex items-center rounded-md px-3 py-1.5 text-xs font-medium"
              style={{
                backgroundColor: `hsl(${config.colors.destructive})`,
                color: `hsl(${config.colors.destructiveForeground})`,
                borderRadius: config.radius.md,
              }}
            >
              Destructive
            </span>
          </div>
          <div
            className="rounded-md border p-3 text-xs"
            style={{
              borderColor: `hsl(${config.colors.border})`,
              backgroundColor: `hsl(${config.colors.muted})`,
              color: `hsl(${config.colors.mutedForeground})`,
              borderRadius: config.radius.sm,
            }}
          >
            Muted content area
          </div>
        </div>
      </div>

      {/* Save with note */}
      <div>
        <label className="block text-sm font-medium mb-1">Version Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Updated primary color for better contrast"
          className="w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Version History */}
      {versions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Version History</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {versions.map((v) => {
              const isActive = v.id === activeVersionId;
              return (
                <div
                  key={v.id}
                  className={`flex items-center justify-between rounded-md border p-3 text-sm ${
                    isActive
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      v{v.version}
                    </span>
                    <span className="truncate text-muted-foreground">
                      {v.note || "No note"}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </span>
                    {isActive && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground whitespace-nowrap">
                        Active
                      </span>
                    )}
                  </div>
                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => handleRollback(v.id, v.version)}
                      disabled={isPending}
                      className="ml-2 shrink-0 rounded-md border border-border px-2 py-1 text-xs hover:bg-accent disabled:opacity-50"
                    >
                      Rollback
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save as New Version"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
