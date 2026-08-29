"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ThemeConfig } from "@/db/schema";

interface ThemePreviewContextValue {
  /** The active (saved) theme config — never changes during preview. */
  activeConfig: ThemeConfig;
  /** Currently previewing config, or null when not previewing. */
  previewConfig: ThemeConfig | null;
  /** The name of the theme being previewed (for the banner). */
  previewName: string | null;
  /** The slug of the theme being previewed (for activation). */
  previewSlug: string | null;
  /** Start previewing a theme. */
  startPreview: (config: ThemeConfig, name: string, slug: string) => void;
  /** Stop previewing and revert to the active theme. */
  stopPreview: () => void;
}

const ThemePreviewContext = createContext<ThemePreviewContextValue | null>(null);

export function ThemePreviewProvider({
  activeConfig,
  children,
}: {
  activeConfig: ThemeConfig;
  children: ReactNode;
}) {
  const [previewConfig, setPreviewConfig] = useState<ThemeConfig | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  const startPreview = useCallback((config: ThemeConfig, name: string, slug: string) => {
    setPreviewConfig(config);
    setPreviewName(name);
    setPreviewSlug(slug);
  }, []);

  const stopPreview = useCallback(() => {
    setPreviewConfig(null);
    setPreviewName(null);
    setPreviewSlug(null);
  }, []);

  const value = useMemo(
    () => ({
      activeConfig,
      previewConfig,
      previewName,
      previewSlug,
      startPreview,
      stopPreview,
    }),
    [activeConfig, previewConfig, previewName, previewSlug, startPreview, stopPreview]
  );

  return (
    <ThemePreviewContext.Provider value={value}>
      {children}
    </ThemePreviewContext.Provider>
  );
}

/**
 * Hook to access the theme preview state and controls.
 * Must be used inside a `<ThemePreviewProvider>`.
 */
export function useThemePreview() {
  const ctx = useContext(ThemePreviewContext);
  if (!ctx) {
    throw new Error("useThemePreview must be used within a ThemePreviewProvider");
  }
  return ctx;
}
