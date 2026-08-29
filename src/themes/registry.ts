import type { ThemeConfig } from "./types";

export type ThemeDefinition = {
  id: string;
  name: string;
  config: ThemeConfig;
};

export const builtInThemes: Record<string, ThemeDefinition> = {
  default: {
    id: "default",
    name: "Default",
    config: {
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
    },
  },
  blue: {
    id: "blue",
    name: "Blue",
    config: {
      colors: {
        background: "0 0% 100%",
        foreground: "222.2 84% 4.9%",
        card: "0 0% 100%",
        cardForeground: "222.2 84% 4.9%",
        primary: "221.2 83.2% 53.3%",
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
        ring: "221.2 83.2% 53.3%",
      },
      radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
      typography: {
        fontFamily: "var(--font-geist-sans)",
      },
    },
  },
  dark: {
    id: "dark",
    name: "Dark",
    config: {
      colors: {
        background: "222.2 84% 4.9%",
        foreground: "210 40% 98%",
        card: "222.2 84% 4.9%",
        cardForeground: "210 40% 98%",
        primary: "210 40% 98%",
        primaryForeground: "222.2 47.4% 11.2%",
        secondary: "217.2 32.6% 17.5%",
        secondaryForeground: "210 40% 98%",
        muted: "217.2 32.6% 17.5%",
        mutedForeground: "215 20.2% 65.1%",
        accent: "217.2 32.6% 17.5%",
        accentForeground: "210 40% 98%",
        destructive: "0 62.8% 30.6%",
        destructiveForeground: "210 40% 98%",
        border: "217.2 32.6% 17.5%",
        input: "217.2 32.6% 17.5%",
        ring: "212.7 26.8% 83.9%",
      },
      radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
      typography: {
        fontFamily: "var(--font-geist-sans)",
      },
    },
  },
  purple: {
    id: "purple",
    name: "Purple",
    config: {
      colors: {
        background: "0 0% 100%",
        foreground: "224 71.4% 4.1%",
        card: "0 0% 100%",
        cardForeground: "224 71.4% 4.1%",
        primary: "262.1 83.3% 57.8%",
        primaryForeground: "210 20% 98%",
        secondary: "220 14.3% 95.9%",
        secondaryForeground: "220.9 39.3% 11%",
        muted: "220 14.3% 95.9%",
        mutedForeground: "220 8.9% 46.1%",
        accent: "220 14.3% 95.9%",
        accentForeground: "220.9 39.3% 11%",
        destructive: "0 84.2% 60.2%",
        destructiveForeground: "210 20% 98%",
        border: "220 13% 91%",
        input: "220 13% 91%",
        ring: "262.1 83.3% 57.8%",
      },
      radius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "1rem",
      },
      typography: {
        fontFamily: "var(--font-geist-sans)",
      },
    },
  },
  emerald: {
    id: "emerald",
    name: "Emerald",
    config: {
      colors: {
        background: "0 0% 100%",
        foreground: "140 10% 10%",
        card: "0 0% 100%",
        cardForeground: "140 10% 10%",
        primary: "160 84% 39%",
        primaryForeground: "0 0% 100%",
        secondary: "152 20% 95%",
        secondaryForeground: "160 10% 15%",
        muted: "152 20% 95%",
        mutedForeground: "155 10% 45%",
        accent: "152 20% 95%",
        accentForeground: "160 10% 15%",
        destructive: "0 84% 60%",
        destructiveForeground: "0 0% 100%",
        border: "152 15% 90%",
        input: "152 15% 90%",
        ring: "160 84% 39%",
      },
      radius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
      },
      typography: {
        fontFamily: "var(--font-geist-sans)",
      },
    },
  },
};

export function getThemeById(id: string): ThemeDefinition | undefined {
  return builtInThemes[id];
}

export function listThemeIds(): string[] {
  return Object.keys(builtInThemes);
}
