import fs from "fs";
import path from "path";

export interface SiteData {
  siteName: string;
  logoUrl?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl?: string;
  aboutText: string;
  aboutImageUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  theme?: ThemeData;
  seo?: SeoData;
}

export interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
  content: string;
  sourcePath?: string;
}

interface CompanyFile {
  site?: SiteData & { theme?: ThemeData };
  theme?: ThemeData;
  seo?: SeoData;
}

interface RawPostData {
  slug?: string;
  title?: string;
  excerpt?: string;
  category?: string;
  imageUrl?: string;
  author?: string;
  publishedAt?: string;
  content?: string;
}

const contentRoot = path.join(process.cwd(), "src", "content");

function readJson<T>(filePath: string): T | null {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadSite(): SiteData {
  const company = readJson<CompanyFile>(path.join(contentRoot, "company.json"));

  // Prioritize environment variables for runtime personalization
  const envSiteName = process.env.NEXT_PUBLIC_ORG_NAME || process.env.ORG_NAME;
  const envLogoUrl =
    process.env.NEXT_PUBLIC_ORG_LOGO_URL || process.env.ORG_LOGO_URL;
  const envSeoTitle = process.env.NEXT_PUBLIC_SEO_TITLE;
  const envSeoDescription = process.env.NEXT_PUBLIC_SEO_DESCRIPTION;

  // Use environment variables first, then fall back to company.json, then defaults
  const siteName =
    envSiteName?.trim() || company?.site?.siteName || "Your Company Blog";
  const logoUrl = envLogoUrl?.trim() || company?.site?.logoUrl;
  const heroTitle =
    company?.site?.heroTitle ||
    `Insights and stories from the ${siteName} team`;
  const heroSubtitle =
    company?.site?.heroSubtitle ||
    "Thought leadership, case studies, and best practices to help you grow.";
  const aboutText =
    company?.site?.aboutText ||
    "We are a team of experts passionate about helping businesses succeed.";

  return {
    siteName,
    logoUrl,
    heroTitle,
    heroSubtitle,
    heroImageUrl: company?.site?.heroImageUrl,
    aboutText,
    aboutImageUrl: company?.site?.aboutImageUrl,
    contactEmail: company?.site?.contactEmail,
    contactPhone: company?.site?.contactPhone,
    contactAddress: company?.site?.contactAddress,
    theme: loadTheme(),
    seo: loadSeo(),
  };
}

export interface ThemeData {
  colors?: {
    primary?: string;
    secondary?: string;
    background?: string;
    foreground?: string;
  };
}

export function loadTheme(): ThemeData | undefined {
  const company = readJson<CompanyFile>(path.join(contentRoot, "company.json"));
  const cfg = company?.theme || company?.site?.theme || {};
  const envPrimary = process.env.NEXT_PUBLIC_PRIMARY_COLOR;
  const envSecondary = process.env.NEXT_PUBLIC_SECONDARY_COLOR;
  const envBackground = process.env.NEXT_PUBLIC_BACKGROUND_COLOR;
  const envForeground = process.env.NEXT_PUBLIC_FOREGROUND_COLOR;
  return {
    colors: {
      primary: envPrimary || cfg.colors?.primary,
      secondary: envSecondary || cfg.colors?.secondary,
      background: envBackground || cfg.colors?.background,
      foreground: envForeground || cfg.colors?.foreground,
    },
  };
}

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string | string[];
}

export function loadSeo(): SeoData | undefined {
  const company = readJson<CompanyFile>(path.join(contentRoot, "company.json"));

  // Prioritize environment variables for SEO
  const envTitle = process.env.NEXT_PUBLIC_SEO_TITLE;
  const envDescription = process.env.NEXT_PUBLIC_SEO_DESCRIPTION;
  const envKeywords = process.env.NEXT_PUBLIC_SEO_KEYWORDS;

  return {
    title: envTitle || company?.seo?.title,
    description: envDescription || company?.seo?.description,
    keywords: envKeywords || company?.seo?.keywords,
  };
}

export function loadPosts(): PostData[] {
  const collected: PostData[] = [];

  // Load per-file posts from src/content/posts/*.json
  const postsDir = path.join(contentRoot, "posts");
  if (fs.existsSync(postsDir)) {
    const files = fs.readdirSync(postsDir).sort();
    for (const f of files) {
      const full = path.join(postsDir, f);
      if (!f.endsWith(".json")) continue;

      const fileBaseSlug = f.replace(/\.json$/i, "");
      const rawData = readJson<RawPostData | RawPostData[]>(full);
      if (!rawData) continue;

      const toPostData = (record: RawPostData): PostData | null => {
        const slug = (record?.slug as string) || fileBaseSlug;
        const content = (record?.content as string) || "";
        const titleFromHeading = content
          .split("\n")
          .find((line) => line.trim().startsWith("# "))
          ?.replace(/^#\s+/, "")
          ?.trim();
        const plainText = content
          .replace(/```[\s\S]*?```/g, " ")
          .replace(/`[^`]*`/g, " ")
          .replace(/[#>*_`\-]/g, " ")
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .join(" ");
        const humanizedFromSlug = slug
          .split(/[-_]+/)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(" ");

        const title =
          (record?.title as string) || titleFromHeading || humanizedFromSlug;
        const excerpt =
          (record?.excerpt as string) || plainText.slice(0, 180).trim();
        const publishedAt =
          (record?.publishedAt as string) ||
          new Date().toISOString().slice(0, 10);
        const author = (record?.author as string) || "Editorial Team";
        const imageUrl = (record?.imageUrl as string) || undefined;
        const category = (record?.category as string) || undefined;

        return {
          slug,
          title,
          excerpt,
          category,
          imageUrl,
          author,
          publishedAt,
          content,
          sourcePath: full,
        };
      };

      if (Array.isArray(rawData)) {
        for (const item of rawData) {
          const normalized = toPostData(item);
          if (normalized) collected.push(normalized);
        }
      } else {
        const normalized = toPostData(rawData);
        if (normalized) collected.push(normalized);
      }
    }
  }
  return collected;
}
