"use client";

import { useEffect } from "react";
import type { ThemeConfig } from "./types";
import { getFontById } from "./fonts";
import { useThemePreview } from "./preview-context";

interface ThemeProviderProps {
  theme: ThemeConfig;
  children: React.ReactNode;
}

/**
 * Applies theme CSS variables to :root via style properties.
 * Respects preview state from ThemePreviewProvider — when a preview
 * is active, the preview config is applied instead of the base theme.
 */
export function ThemeProvider({ theme, children }: ThemeProviderProps) {
  const { previewConfig } = useThemePreview();
  const activeTheme = previewConfig ?? theme;

  useEffect(() => {
    const root = document.documentElement;
    const font = getFontById(activeTheme.typography.fontFamily);

    // Colors
    root.style.setProperty("--background", activeTheme.colors.background);
    root.style.setProperty("--foreground", activeTheme.colors.foreground);
    root.style.setProperty("--card", activeTheme.colors.card);
    root.style.setProperty("--card-foreground", activeTheme.colors.cardForeground);
    root.style.setProperty("--primary", activeTheme.colors.primary);
    root.style.setProperty("--primary-foreground", activeTheme.colors.primaryForeground);
    root.style.setProperty("--secondary", activeTheme.colors.secondary);
    root.style.setProperty("--secondary-foreground", activeTheme.colors.secondaryForeground);
    root.style.setProperty("--muted", activeTheme.colors.muted);
    root.style.setProperty("--muted-foreground", activeTheme.colors.mutedForeground);
    root.style.setProperty("--accent", activeTheme.colors.accent);
    root.style.setProperty("--accent-foreground", activeTheme.colors.accentForeground);
    root.style.setProperty("--destructive", activeTheme.colors.destructive);
    root.style.setProperty("--destructive-foreground", activeTheme.colors.destructiveForeground);
    root.style.setProperty("--border", activeTheme.colors.border);
    root.style.setProperty("--input", activeTheme.colors.input);
    root.style.setProperty("--ring", activeTheme.colors.ring);

    // Radius
    root.style.setProperty("--radius-sm", activeTheme.radius.sm);
    root.style.setProperty("--radius-md", activeTheme.radius.md);
    root.style.setProperty("--radius-lg", activeTheme.radius.lg);

    // Typography
    root.style.setProperty("--font-sans", font?.family ?? "system-ui, sans-serif");

    // Dynamically load Google Font if needed
    if (font?.importUrl) {
      const existingLink = document.querySelector(
        `link[href="${font.importUrl}"]`
      );
      if (!existingLink) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = font.importUrl;
        document.head.appendChild(link);
      }
    }
  }, [activeTheme]);

  return <>{children}</>;
}
