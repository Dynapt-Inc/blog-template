import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  loadSite,
  loadTheme,
  loadSeo,
  SeoData,
  ThemeData,
} from "@/lib/content";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateMetadata(): Metadata {
  const site = loadSite();
  const seo: SeoData | undefined = site.seo || loadSeo();
  return {
    title: seo?.title || site.siteName,
    description: seo?.description || site.heroSubtitle,
    keywords: seo?.keywords
      ? Array.isArray(seo.keywords)
        ? seo.keywords
        : [seo.keywords]
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme: ThemeData | undefined = loadTheme();
  const styleVars: Record<string, string | undefined> = {
    "--primary": theme?.colors?.primary,
    "--secondary": theme?.colors?.secondary,
    "--background": theme?.colors?.background,
    "--foreground": theme?.colors?.foreground,
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
