import type { ThemeConfig } from "./types";
import { getFontById } from "./fonts";

/**
 * Server component that injects theme CSS variables as a <style> tag.
 * This ensures the correct theme is applied on first paint (no FOUC).
 */
export function ThemeStyle({ config }: { config: ThemeConfig }) {
  const font = getFontById(config.typography.fontFamily);

  const css = `
    :root {
      --background: ${config.colors.background};
      --foreground: ${config.colors.foreground};
      --card: ${config.colors.card};
      --card-foreground: ${config.colors.cardForeground};
      --primary: ${config.colors.primary};
      --primary-foreground: ${config.colors.primaryForeground};
      --secondary: ${config.colors.secondary};
      --secondary-foreground: ${config.colors.secondaryForeground};
      --muted: ${config.colors.muted};
      --muted-foreground: ${config.colors.mutedForeground};
      --accent: ${config.colors.accent};
      --accent-foreground: ${config.colors.accentForeground};
      --destructive: ${config.colors.destructive};
      --destructive-foreground: ${config.colors.destructiveForeground};
      --border: ${config.colors.border};
      --input: ${config.colors.input};
      --ring: ${config.colors.ring};
      --radius-sm: ${config.radius.sm};
      --radius-md: ${config.radius.md};
      --radius-lg: ${config.radius.lg};
      --font-sans: ${font?.family ?? "system-ui, sans-serif"};
    }
  `;

  return (
    <>
      {font?.importUrl && (
        <link rel="stylesheet" href={font.importUrl} />
      )}
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
