"use client";

import { useThemePreview } from "@/themes/preview-context";
import { activateTheme } from "@/app/admin/actions";
import { useTransition } from "react";

export function ThemePreviewBar() {
  const { previewConfig, previewName, previewSlug, stopPreview } = useThemePreview();
  const [isPending, startTransition] = useTransition();

  if (!previewConfig || !previewName) return null;

  function handleApply() {
    if (!previewSlug) return;
    startTransition(async () => {
      await activateTheme(previewSlug);
      stopPreview();
    });
  }

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 flex items-center justify-center gap-3 border-t border-border bg-card/95 px-4 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{
            backgroundColor: `hsl(${previewConfig.colors.primary})`,
          }}
        />
        <span className="text-sm font-medium">
          Previewing <span className="font-semibold">{previewName}</span>
        </span>
      </div>
      <button
        onClick={stopPreview}
        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium hover:bg-accent"
      >
        Revert
      </button>
      <button
        onClick={handleApply}
        disabled={isPending}
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Applying..." : "Apply Theme"}
      </button>
    </div>
  );
}
