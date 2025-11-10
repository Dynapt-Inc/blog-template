import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { loadSite, loadTheme, loadSeo } from "@caleblawson/blog-shell/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  try {
    const site = loadSite();
    const seo = site.seo || loadSeo();
    return {
      title: seo?.title || site.siteName,
      description: seo?.description || site.heroSubtitle,
      keywords: seo?.keywords
        ? Array.isArray(seo.keywords)
          ? seo.keywords
          : [seo.keywords]
        : undefined,
    };
  } catch (error) {
    console.warn("Failed to load site metadata, using defaults:", error);
    return {
      title: "Blog Template",
      description: "A blog template built with Next.js",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Try to load theme, fallback to defaults if it fails
  let theme;
  try {
    theme = loadTheme();
  } catch (error) {
    console.warn("Failed to load theme, using defaults:", error);
  }

  // Prioritize environment variables for runtime CSS custom properties
  const styleVars: Record<string, string | undefined> = {
    "--primary":
      process.env.NEXT_PUBLIC_PRIMARY_COLOR ||
      theme?.colors?.primary ||
      "#3b82f6",
    "--secondary":
      process.env.NEXT_PUBLIC_SECONDARY_COLOR ||
      theme?.colors?.secondary ||
      "#64748b",
    "--tertiary":
      process.env.NEXT_PUBLIC_TERTIARY_COLOR ||
      theme?.colors?.tertiary ||
      "#8b5cf6",
    "--background":
      process.env.NEXT_PUBLIC_BACKGROUND_COLOR ||
      theme?.colors?.background ||
      "#ffffff",
    "--foreground":
      process.env.NEXT_PUBLIC_FOREGROUND_COLOR ||
      theme?.colors?.foreground ||
      "#000000",
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={styleVars as React.CSSProperties}
      >
        {children}
      </body>
    </html>
  );
}
