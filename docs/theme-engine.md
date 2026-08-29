ถ้าจะทำ **Theme Engine สำหรับ Next.js + shadcn/ui** ผมแนะนำให้ใช้แนวคิด **Design Tokens + CSS Variables + Theme Registry** มากที่สุด เพราะเข้ากับ shadcn โดยตรง และสามารถเปลี่ยน theme ตอน runtime ได้โดยไม่ต้อง build ใหม่

### Architecture

```text
Next.js
│
├── app/
│
├── components/
│   └── ui/                 ← shadcn components
│
├── themes/
│   ├── registry.ts         ← theme definitions
│   ├── provider.tsx
│   ├── tokens.ts
│   └── types.ts
│
└── styles/
    └── globals.css
```

### 1. shadcn ใช้ CSS Variables เป็นฐาน

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  --radius: 0.5rem;
}
```

shadcn component ก็ใช้ token เหล่านี้:

```tsx
<Button>Submit</Button>
```

ไม่ต้องแก้ component ตาม theme

---

### 2. Theme เป็น configuration

```ts
export type Theme = {
  id: string;
  name: string;

  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
  };

  radius: string;
};
```

ตัวอย่าง:

```ts
export const themes = {
  blue: {
    id: "blue",
    name: "Blue",

    colors: {
      background: "0 0% 100%",
      foreground: "222 47% 11%",
      primary: "221 83% 53%",
      primaryForeground: "210 40% 98%",
    },

    radius: "0.5rem",
  },

  dark: {
    id: "dark",
    name: "Dark",

    colors: {
      background: "222 47% 11%",
      foreground: "210 40% 98%",
      primary: "217 91% 60%",
      primaryForeground: "222 47% 11%",
    },

    radius: "0.75rem",
  },
};
```

---

### 3. Theme Provider

```tsx
"use client";

import { useEffect } from "react";

export function ThemeProvider({ theme, children }) {
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--background",
      theme.colors.background
    );

    root.style.setProperty(
      "--foreground",
      theme.colors.foreground
    );

    root.style.setProperty(
      "--primary",
      theme.colors.primary
    );

    root.style.setProperty(
      "--primary-foreground",
      theme.colors.primaryForeground
    );

    root.style.setProperty("--radius", theme.radius);
  }, [theme]);

  return children;
}
```

จากนั้น:

```tsx
<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>
```

---

## 4. ถ้าต้องการเปลี่ยน Theme หลัง Build

สามารถเก็บ theme ใน DB:

```text
themes
────────────────────────
id
name
config
active
```

`config`:

```json
{
  "background": "222 47% 11%",
  "foreground": "210 40% 98%",
  "primary": "217 91% 60%",
  "primaryForeground": "222 47% 11%",
  "radius": "0.75rem"
}
```

Flow:

```text
Admin
  │
  │ Change Theme
  ▼
Database
  │
  │ get active theme
  ▼
Next.js Server
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

ดังนั้น:

```text
next build
    ↓
deploy
    ↓
เปลี่ยน theme ใน DB
    ↓
reload
    ↓
Theme ใหม่
```

**ไม่ต้อง build ใหม่**

---

## 5. ถ้าต้องการหลาย Theme

ทำ Registry สำหรับ theme ที่ระบบรองรับ:

```ts
const themeRegistry = {
  default: defaultTheme,
  corporate: corporateTheme,
  modern: modernTheme,
  dark: darkTheme,
};
```

Database เก็บเพียง:

```json
{
  "activeTheme": "modern"
}
```

แล้ว server:

```ts
const theme = themeRegistry[settings.activeTheme];
```

---

## 6. ถ้าอยาก Theme ได้มากกว่าแค่สี

ผมแนะนำแบ่งเป็น **Design Tokens**

```text
Theme
├── colors
│   ├── primary
│   ├── secondary
│   ├── background
│   ├── foreground
│   ├── muted
│   └── destructive
│
├── typography
│   ├── fontFamily
│   ├── heading
│   └── body
│
├── radius
│   ├── sm
│   ├── md
│   └── lg
│
├── spacing
│
├── shadows
│
└── components
    ├── button
    ├── card
    └── input
```

ตัวอย่าง:

```json
{
  "colors": {
    "primary": "262 83% 58%",
    "secondary": "240 5% 96%"
  },

  "radius": {
    "sm": "0.25rem",
    "md": "0.5rem",
    "lg": "1rem"
  },

  "components": {
    "button": {
      "radius": "0.75rem"
    }
  }
}
```

### สรุป

สำหรับ **Next.js + shadcn/ui**:

> **อย่าทำ Theme Engine ที่เปลี่ยน React components โดยตรง**

ให้ทำเป็น:

**`Theme Registry → Design Tokens → CSS Variables → shadcn/ui`**

เพราะเป็นวิธีที่ง่าย, เร็ว, SSR-friendly และสามารถเปลี่ยน theme หลัง `next build` ได้โดยไม่ต้อง compile application ใหม่.
