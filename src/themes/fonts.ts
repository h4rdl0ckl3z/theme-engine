export interface FontDefinition {
  id: string;
  name: string;
  /** CSS font-family value */
  family: string;
  /** Google Fonts import URL */
  importUrl: string;
  /** Font weight variants to load */
  weights: number[];
}

/**
 * Curated list of Google Fonts available for themes.
 * Each entry includes the import URL and CSS family value.
 */
export const availableFonts: FontDefinition[] = [
  {
    id: "inter",
    name: "Inter",
    family: "'Inter', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "'Roboto', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap",
    weights: [300, 400, 500, 700],
  },
  {
    id: "open-sans",
    name: "Open Sans",
    family: "'Open Sans', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "lato",
    name: "Lato",
    family: "'Lato', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap",
    weights: [300, 400, 700, 900],
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "'Montserrat', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "'Poppins', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "nunito",
    name: "Nunito",
    family: "'Nunito', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "raleway",
    name: "Raleway",
    family: "'Raleway', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "work-sans",
    name: "Work Sans",
    family: "'Work Sans', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "dm-sans",
    name: "DM Sans",
    family: "'DM Sans', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "space-grotesk",
    name: "Space Grotesk",
    family: "'Space Grotesk', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "outfit",
    name: "Outfit",
    family: "'Outfit', sans-serif",
    importUrl:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap",
    weights: [300, 400, 500, 600, 700],
  },
  {
    id: "geist",
    name: "Geist",
    family: "var(--font-geist-sans), sans-serif",
    importUrl: "",
    weights: [],
  },
  {
    id: "system",
    name: "System UI",
    family: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    importUrl: "",
    weights: [],
  },
];

/**
 * Get font definition by ID.
 */
export function getFontById(id: string): FontDefinition | undefined {
  return availableFonts.find((f) => f.id === id);
}

/**
 * Get the CSS @import rule for a font (empty if no external font).
 */
export function getFontImport(fontId: string): string {
  const font = getFontById(fontId);
  if (!font || !font.importUrl) return "";
  return `@import url('${font.importUrl}');`;
}
