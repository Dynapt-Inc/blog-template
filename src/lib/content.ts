import { unstable_noStore as noStore } from "next/cache";
import { fetchPostBySlug, fetchPublishedPosts, type BlogPostRecord } from "./posts";
import { getBrandConfig } from "./brand-config";
import type { SeoData, SiteData, ThemeData } from "./site";

export interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
  content: string;
  sourcePath?: string | null;
  url?: string | null;
}

export function loadSite(): SiteData {
  const brand = getBrandConfig();
  const siteBlock = brand.site || {};

  // Prioritize environment variables for runtime personalization
  const envSiteName = process.env.NEXT_PUBLIC_ORG_NAME || process.env.ORG_NAME;
  const envLogoUrl =
    process.env.NEXT_PUBLIC_ORG_LOGO_URL || process.env.ORG_LOGO_URL;
  // Use environment variables first, then fall back to the brand config, then defaults
  const siteName =
    envSiteName?.trim() || siteBlock.siteName || "Your Company Blog";
  const logoUrl = envLogoUrl?.trim() || siteBlock.logoUrl;
  const heroTitle =
    siteBlock.heroTitle || `Insights and stories from the ${siteName} team`;
  const heroSubtitle =
    siteBlock.heroSubtitle ||
    "Thought leadership, case studies, and best practices to help you grow.";
  const aboutText =
    siteBlock.aboutText ||
    "We are a team of experts passionate about helping businesses succeed.";

  return {
    siteName,
    logoUrl,
    heroTitle,
    heroSubtitle,
    heroImageUrl: siteBlock.heroImageUrl,
    aboutText,
    aboutImageUrl: siteBlock.aboutImageUrl,
    contactEmail: siteBlock.contactEmail,
    contactPhone: siteBlock.contactPhone,
    contactAddress: siteBlock.contactAddress,
    theme: loadTheme(),
    seo: loadSeo(),
  };
}

export function loadTheme(): ThemeData | undefined {
  const brand = getBrandConfig();
  const cfg = brand.theme || brand.site?.theme || {};
  const envPrimary = process.env.NEXT_PUBLIC_PRIMARY_COLOR;
  const envSecondary = process.env.NEXT_PUBLIC_SECONDARY_COLOR;
  const envTertiary = process.env.NEXT_PUBLIC_TERTIARY_COLOR;
  const envBackground = process.env.NEXT_PUBLIC_BACKGROUND_COLOR;
  const envForeground = process.env.NEXT_PUBLIC_FOREGROUND_COLOR;
  return {
    colors: {
      primary: envPrimary || cfg.colors?.primary,
      secondary: envSecondary || cfg.colors?.secondary,
      tertiary: envTertiary || cfg.colors?.tertiary,
      background: envBackground || cfg.colors?.background,
      foreground: envForeground || cfg.colors?.foreground,
    },
  };
}

export function loadSeo(): SeoData | undefined {
  const brand = getBrandConfig();

  // Prioritize environment variables for SEO
  const envTitle = process.env.NEXT_PUBLIC_SEO_TITLE;
  const envDescription = process.env.NEXT_PUBLIC_SEO_DESCRIPTION;
  const envKeywords = process.env.NEXT_PUBLIC_SEO_KEYWORDS;

  return {
    title: envTitle || brand.seo?.title || brand.site?.seo?.title,
    description:
      envDescription ||
      brand.seo?.description ||
      brand.site?.seo?.description,
    keywords: envKeywords || brand.seo?.keywords || brand.site?.seo?.keywords,
  };
}

function resolveTenantId(): string | null {
  const explicit = process.env.BLOG_TENANT_ID?.trim();
  if (explicit) return explicit;
  const publicId = process.env.NEXT_PUBLIC_BLOG_TENANT_ID?.trim();
  if (publicId) return publicId;
  return null;
}

function fallbackExcerpt(content: string, maxLen = 180): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_`\-]/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join(" ");
  return plainText.slice(0, maxLen).trim();
}

function recordToPost(record: BlogPostRecord): PostData {
  const metadata = record.metadata || {};
  const category =
    typeof metadata.category === "string" && metadata.category.trim().length
      ? (metadata.category as string)
      : undefined;
  const imageUrl =
    typeof metadata.imageUrl === "string" && metadata.imageUrl.trim().length
      ? (metadata.imageUrl as string)
      : undefined;
  const author =
    typeof metadata.author === "string" && metadata.author.trim().length
      ? (metadata.author as string)
      : "Editorial Team";

  const excerpt =
    (record.excerpt && record.excerpt.trim().length > 0
      ? record.excerpt
      : fallbackExcerpt(record.content)) || "";

  return {
    slug: record.slug,
    title: record.title,
    excerpt,
    category,
    imageUrl,
    author,
    publishedAt: record.publishedAt || record.createdAt,
    content: record.content,
    sourcePath: null,
    url: record.url,
  };
}

export async function loadPosts(): Promise<PostData[]> {
  noStore();
  const tenantId = resolveTenantId();
  if (!tenantId) {
    console.warn(
      "[content] BLOG_TENANT_ID is not configured; returning empty post list."
    );
    return [];
  }
  const records = await fetchPublishedPosts(tenantId);
  return records.map(recordToPost);
}

export async function loadPostBySlug(slug: string): Promise<PostData | null> {
  noStore();
  const tenantId = resolveTenantId();
  if (!tenantId) {
    console.warn(
      "[content] BLOG_TENANT_ID is not configured; cannot load post."
    );
    return null;
  }
  const record = await fetchPostBySlug(tenantId, slug);
  return record ? recordToPost(record) : null;
}

export type { SiteData, ThemeData, SeoData } from "./site";
