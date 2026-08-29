ถ้าจะทำ **Next.js + shadcn + Theme Engine + PostgreSQL + Drizzle ORM** ผมแนะนำโครงสร้างแบบนี้ครับ

```text
Next.js
│
├── Theme Engine
│   │
│   ├── Theme Registry
│   ├── Theme Resolver
│   └── CSS Variables
│
├── shadcn/ui
│
├── Drizzle ORM
│       │
│       ▼
│   PostgreSQL
│
└── Admin
        │
        └── Theme Management
```

## Database Schema

ไม่จำเป็นต้องสร้างหลาย table เยอะ ๆ ในช่วงแรก ใช้ `themes` + `theme_settings` ก็พอ

### `themes`

```ts
import {
  pgTable,
  uuid,
  varchar,
  boolean,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

export const themes = pgTable("themes", {
  id: uuid("id").defaultRandom().primaryKey(),

  slug: varchar("slug", {
    length: 100,
  }).notNull().unique(),

  name: varchar("name", {
    length: 150,
  }).notNull(),

  config: jsonb("config")
    .$type<ThemeConfig>()
    .notNull(),

  isActive: boolean("is_active")
    .notNull()
    .default(false),

  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),

  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow(),
});
```

Type:

```ts
export type ThemeConfig = {
  colors: {
    background: string;
    foreground: string;

    primary: string;
    primaryForeground: string;

    secondary: string;
    secondaryForeground: string;

    muted: string;
    mutedForeground: string;

    border: string;
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
```

---

# Runtime Flow

```text
PostgreSQL
    │
    │ Drizzle
    ▼
getActiveTheme()
    │
    ▼
Theme Resolver
    │
    ▼
ThemeProvider
    │
    ▼
CSS Variables
    │
    ▼
shadcn/ui
```

ตัวอย่าง query:

```ts
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { themes } from "@/db/schema";

export async function getActiveTheme() {
  return db.query.themes.findFirst({
    where: eq(themes.isActive, true),
  });
}
```

---

# Theme → CSS Variables

ผมแนะนำให้ **Server Component โหลด Theme** แล้วส่ง config ลง `ThemeProvider`

```tsx
const theme = await getActiveTheme();

return (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);
```

แล้ว Provider สร้าง CSS variables:

```tsx
"use client";

export function ThemeProvider({
  theme,
  children,
}: {
  theme: ThemeConfig;
  children: React.ReactNode;
}) {
  const style = {
    "--background": theme.colors.background,
    "--foreground": theme.colors.foreground,

    "--primary": theme.colors.primary,
    "--primary-foreground":
      theme.colors.primaryForeground,

    "--secondary": theme.colors.secondary,
    "--secondary-foreground":
      theme.colors.secondaryForeground,

    "--radius-sm": theme.radius.sm,
    "--radius-md": theme.radius.md,
    "--radius-lg": theme.radius.lg,
  } as React.CSSProperties;

  return (
    <div style={style}>
      {children}
    </div>
  );
}
```

หรือถ้าต้องการให้ variables อยู่ที่ `html` จริง ๆ สามารถสร้าง `<style>` ใน Server Component ได้ ซึ่งเหมาะกว่าในบางกรณีเพราะไม่ต้องรอ client hydration

---

# shadcn

จากนั้น shadcn ไม่ต้องรู้เรื่อง Theme Engine เลย

```tsx
import { Button } from "@/components/ui/button";

export function Example() {
  return (
    <Button>
      Save
    </Button>
  );
}
```

shadcn:

```css
background: hsl(var(--primary));
```

Theme Engine เป็นคนกำหนด:

```css
--primary: 221 83% 53%;
```

---

# Admin Theme Editor

Admin สามารถแก้:

```text
Theme
├── General
│   ├── Name
│   └── Slug
│
├── Colors
│   ├── Primary
│   ├── Secondary
│   ├── Background
│   └── Foreground
│
├── Typography
│   └── Font
│
├── Radius
│   ├── Small
│   ├── Medium
│   └── Large
│
└── Status
    └── Active
```

กด Save:

```text
Admin
  ↓
Server Action
  ↓
Drizzle
  ↓
PostgreSQL
```

แล้ว invalidate cache:

```ts
revalidatePath("/", "layout");
```

---

# จุดที่สำคัญมาก

ถ้า requirement คือ:

> **Build ครั้งเดียว → เปลี่ยน Theme จาก Database ได้**

อย่าใช้:

```ts
const theme = process.env.THEME;
```

หรือ:

```ts
import theme from "./theme.json";
```

เพราะสิ่งเหล่านี้เป็น build/deploy configuration

ให้ใช้:

```ts
PostgreSQL
   ↓
Drizzle
   ↓
runtime theme
```

แทน

---

## และผมแนะนำเพิ่ม `theme_versions`

ถ้าจะทำจริงจัง:

```text
themes
theme_versions
```

```text
themes
────────────────
id
slug
name
active_version_id


theme_versions
────────────────
id
theme_id
version
config
created_at
```

จะได้:

```text
Theme v1
Theme v2
Theme v3
   ↓
Activate v3
```

ถ้า Theme ใหม่มีปัญหา:

```text
Rollback → v2
```

โดยไม่ต้อง deploy ใหม่

**Stack ที่เหมาะมากคือ `Next.js + shadcn/ui + Drizzle ORM + postgres-js + PostgreSQL` และให้ PostgreSQL เป็น source of truth ของ runtime theme configuration ส่วน shadcn เป็น presentation layer ครับ**
