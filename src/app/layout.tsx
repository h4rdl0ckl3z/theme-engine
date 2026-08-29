import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getActiveTheme } from "@/themes/queries";
import { ThemeStyle } from "@/themes/style";
import { ThemeProvider } from "@/themes/provider";
import { ThemePreviewProvider } from "@/themes/preview-context";
import { ThemePreviewBar } from "@/components/theme-preview-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Theme Engine",
  description: "Runtime theme engine with PostgreSQL + shadcn/ui",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const theme = await getActiveTheme();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <ThemeStyle config={theme.config} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemePreviewProvider activeConfig={theme.config}>
          <ThemeProvider theme={theme.config}>
            {children}
            <ThemePreviewBar />
          </ThemeProvider>
        </ThemePreviewProvider>
      </body>
    </html>
  );
}
