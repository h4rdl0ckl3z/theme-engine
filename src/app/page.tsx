import { getAllThemes, getActiveTheme } from "@/themes/queries";
import { getFontById } from "@/themes/fonts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Eye, Mail, Settings, Trash2 } from "lucide-react";
import type { ThemeConfig } from "@/db/schema";
import { ThemeCardGrid } from "@/components/theme-card-grid";

export const dynamic = "force-dynamic";

export default async function Home() {
  const activeTheme = await getActiveTheme();
  const allThemes = await getAllThemes();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl p-8">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Theme Engine Demo</h1>
          <p className="text-muted-foreground text-lg">
            Runtime themes powered by PostgreSQL + Drizzle ORM + shadcn/ui
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-muted-foreground">Active theme:</span>
            <Badge>{activeTheme.name}</Badge>
            <span className="text-xs text-muted-foreground font-mono">
              ({activeTheme.slug})
            </span>
          </div>
        </header>

        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: "Background", value: activeTheme.config.colors.background },
              { label: "Foreground", value: activeTheme.config.colors.foreground },
              { label: "Card", value: activeTheme.config.colors.card },
              { label: "Primary", value: activeTheme.config.colors.primary },
              { label: "Secondary", value: activeTheme.config.colors.secondary },
              { label: "Muted", value: activeTheme.config.colors.muted },
              { label: "Accent", value: activeTheme.config.colors.accent },
              { label: "Destructive", value: activeTheme.config.colors.destructive },
              { label: "Border", value: activeTheme.config.colors.border },
              { label: "Ring", value: activeTheme.config.colors.ring },
            ].map((color) => (
              <div
                key={color.label}
                className="rounded-lg border border-border overflow-hidden"
              >
                <div
                  className="h-16"
                  style={{ backgroundColor: `hsl(${color.value})` }}
                />
                <div className="p-2">
                  <div className="text-xs font-medium">{color.label}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {color.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-12" />

        {/* Button Variants */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Button</h2>
          <Card>
            <CardHeader>
              <CardTitle>Variants & Sizes</CardTitle>
              <CardDescription>
                All button variants using the theme&apos;s CSS variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button>Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button disabled>Disabled</Button>
                <Button variant="outline" disabled>
                  Disabled Outline
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <Mail className="mr-2 h-4 w-4" />
                  With Icon
                </Button>
                <Button>
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Badge Variants */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Badge</h2>
          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Form Elements */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Form Elements</h2>
          <Card>
            <CardHeader>
              <CardTitle>Input, Label, Textarea & Switch</CardTitle>
              <CardDescription>
                Form controls styled with theme CSS variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input type="email" id="email" placeholder="m@example.com" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password">Password</Label>
                <Input type="password" id="password" placeholder="••••••••" />
              </div>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here." />
              </div>
              <div className="flex items-center gap-3">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Enable notifications</Label>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Card Showcase */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Card</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Alpha</CardTitle>
                <CardDescription>
                  A brand new project using the theme engine.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card demonstrates the Card component with header,
                  content, and footer sections.
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button size="sm">Deploy</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Settings</CardTitle>
                  <Badge variant="secondary">Beta</Badge>
                </div>
                <CardDescription>
                  Manage your theme preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark mode</Label>
                  <Switch id="dark-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="animations">Animations</Label>
                  <Switch id="animations" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="ml-auto text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Typography Preview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Typography</h2>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Active font</p>
                <p className="text-2xl font-semibold">
                  {getFontById(activeTheme.config.typography.fontFamily)?.name ?? "System UI"}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-4xl font-bold">Heading</p>
                <p className="text-2xl font-semibold">Subheading</p>
                <p className="text-lg">Body text at large size</p>
                <p className="text-base">Regular body text for paragraphs and content.</p>
                <p className="text-sm text-muted-foreground">Small text for captions and metadata.</p>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Font weight 300</p>
                  <p className="font-light">The quick brown fox jumps over the lazy dog</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Font weight 400</p>
                  <p className="font-normal">The quick brown fox jumps over the lazy dog</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Font weight 600</p>
                  <p className="font-semibold">The quick brown fox jumps over the lazy dog</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Font weight 700</p>
                  <p className="font-bold">The quick brown fox jumps over the lazy dog</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Radius Preview */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Border Radius</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                {(["sm", "md", "lg"] as const).map((size) => (
                  <div
                    key={size}
                    className="h-16 w-16 bg-primary flex items-center justify-center text-primary-foreground text-xs font-mono"
                    style={{ borderRadius: `var(--radius-${size})` }}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator className="my-12" />

        {/* Theme list */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Available Themes</h2>
          <p className="text-muted-foreground mb-4 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Hover over a theme card to preview it live. Go to{" "}
            <a href="/admin" className="text-primary underline underline-offset-4">
              /admin
            </a>{" "}
            to manage themes.
          </p>
          <ThemeCardGrid
            themes={allThemes.map((t) => ({
              id: t.id,
              slug: t.slug,
              name: t.name,
              isActive: t.isActive,
              config: t.config as ThemeConfig,
              activeVersionId: t.activeVersionId ?? null,
            }))}
          />
        </section>
      </div>
    </div>
  );
}
