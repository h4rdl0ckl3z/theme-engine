import {
  pgTable,
  uuid,
  varchar,
  boolean,
  jsonb,
  timestamp,
  integer,
  text,
} from "drizzle-orm/pg-core";

export type ThemeConfig = {
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
  };
  typography: {
    fontFamily: string;
  };
};

export const themes = pgTable("themes", {
  id: uuid("id").defaultRandom().primaryKey(),

  slug: varchar("slug", { length: 100 }).notNull().unique(),

  name: varchar("name", { length: 150 }).notNull(),

  /** Denormalized copy of the active version's config for fast reads. */
  config: jsonb("config").$type<ThemeConfig>().notNull(),

  isActive: boolean("is_active").notNull().default(false),

  /** Points to the currently active version in theme_versions. */
  activeVersionId: uuid("active_version_id"),

  createdAt: timestamp("created_at").notNull().defaultNow(),

  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const themeVersions = pgTable("theme_versions", {
  id: uuid("id").defaultRandom().primaryKey(),

  themeId: uuid("theme_id")
    .notNull()
    .references(() => themes.id, { onDelete: "cascade" }),

  version: integer("version").notNull(),

  config: jsonb("config").$type<ThemeConfig>().notNull(),

  /** Optional note for why this version was created. */
  note: text("note"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});
