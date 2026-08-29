# Theme Engine

A runtime theme engine built with Next.js, PostgreSQL, and shadcn/ui. Create, edit, and switch themes on the fly — changes apply instantly across the site.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, React 19)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com) + CSS custom properties
- **UI Components:** [shadcn/ui](https://ui.shadcn.com) (Button, Card, Input, Label, Badge, Separator, Switch, Textarea)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Drizzle ORM](https://orm.drizzle.team)
- **Validation:** [Drizzle's jsonb columns](https://orm.drizzle.team/docs/goodies#json) for `ThemeConfig`
- **Fonts:** [Geist](https://vercel.com/font) (Sans & Mono) with dynamic Google Font loading

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (or a compatible connection string)

### Setup

```bash
# Install dependencies
npm install

# Set up your database connection
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL

# Generate and run migrations
npm run db:generate
npm run db:migrate

# (Optional) Seed the database
npm run db:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the theme demo, and [http://localhost:3000/admin](http://localhost:3000/admin) to manage themes.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:push` | Push schema changes directly (no migration files) |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed database with initial data |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — loads active theme, applies CSS vars
│   ├── page.tsx            # Demo page showcasing all UI components
│   ├── globals.css         # Tailwind config + CSS variable definitions
│   └── admin/
│       ├── page.tsx        # Theme management dashboard
│       ├── actions.ts      # Server actions (CRUD, activate, rollback)
│       ├── theme-list.tsx  # Theme list with inline editing
│       ├── theme-form.tsx  # Create new theme form
│       └── theme-edit-form.tsx  # Edit theme with version history
├── components/
│   ├── ui/                 # shadcn/ui components (Button, Card, Input, etc.)
│   ├── theme-card-grid.tsx # Interactive theme cards with hover-to-preview
│   └── theme-preview-bar.tsx  # Floating banner for live preview controls
├── db/
│   ├── index.ts            # Database connection
│   └── schema.ts           # Drizzle schema (themes, theme_versions tables)
├── lib/
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   └── color.ts            # HSL ↔ hex conversion helpers
└── themes/
    ├── types.ts            # ThemeConfig type definition
    ├── registry.ts         # Built-in theme definitions (default, blue, dark, purple, emerald)
    ├── provider.tsx        # Client-side ThemeProvider (applies CSS vars via JS)
    ├── style.tsx           # Server-rendered <style> tag for initial theme load
    ├── preview-context.tsx # React context for live theme preview state
    ├── fonts.ts            # Font registry with dynamic Google Font loading
    └── queries.ts          # Database queries (getActiveTheme, getAllThemes, etc.)
```

## How It Works

### Theme Configuration

Each theme is a `ThemeConfig` object containing:

- **Colors** — 17 HSL color tokens (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, and their foreground counterparts)
- **Radius** — 3 border-radius values (sm, md, lg)
- **Typography** — Font family selection

### Theme Application

1. **Server-side:** `ThemeStyle` component renders a `<style>` tag with CSS variables for the active theme — no flash of unstyled content.
2. **Client-side:** `ThemeProvider` applies CSS variables to `:root` via `document.documentElement.style.setProperty()` for interactive switching after hydration.
3. **Tailwind integration:** CSS variables are mapped to Tailwind theme tokens in `globals.css` via `@theme inline`, so all shadcn/ui components automatically use the active theme.

### Live Preview

Hover over any theme card on the homepage to instantly preview it across the entire site — no database writes, no page reload. A floating bottom bar lets you:

- **Revert** — stop previewing and return to the active theme
- **Apply Theme** — permanently activate the previewed theme via server action

### Version Control

Themes support versioned snapshots. Each edit creates a new version, and you can rollback to any previous version instantly. The active theme's config is denormalized into the `themes` table for fast reads.

## Built-in Themes

| Theme | Description |
|-------|-------------|
| **Default** | Clean neutral palette |
| **Blue** | Blue primary with neutral tones |
| **Dark** | Dark mode with light text |
| **Purple** | Vibrant purple primary |
| **Emerald** | Green-tinted palette |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |

## License

Private
