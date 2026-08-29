"use client";

import { useThemePreview } from "@/themes/preview-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ThemeConfig } from "@/db/schema";

interface ThemeItem {
  id: string;
  slug: string;
  name: string;
  isActive: boolean;
  config: ThemeConfig;
  activeVersionId: string | null;
}

export function ThemeCardGrid({ themes }: { themes: ThemeItem[] }) {
  const { startPreview, stopPreview, previewSlug } = useThemePreview();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {themes.map((theme) => {
        const config = theme.config as ThemeConfig;
        const isPreviewing = previewSlug === theme.slug;
        return (
          <Card
            key={theme.id}
            className={`cursor-pointer transition-all ${
              theme.isActive
                ? "ring-2 ring-primary"
                : isPreviewing
                  ? "ring-2 ring-primary/50"
                  : ""
            }`}
            onMouseEnter={() => startPreview(config, theme.name, theme.slug)}
            onMouseLeave={stopPreview}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: `hsl(${config.colors.primary})`,
                    }}
                  />
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: `hsl(${config.colors.secondary})`,
                    }}
                  />
                </div>
                <CardTitle className="text-base">{theme.name}</CardTitle>
                {theme.isActive && <Badge>Active</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground font-mono">
                {theme.slug}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
