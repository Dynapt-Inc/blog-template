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
  site?: SiteData;
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
  // Allow environment override for organization/site name and logo at runtime
  if (company?.site) {
    const envSiteName =
      process.env.NEXT_PUBLIC_ORG_NAME || process.env.ORG_NAME;
    const envLogoUrl =
      process.env.NEXT_PUBLIC_ORG_LOGO_URL || process.env.ORG_LOGO_URL;
    return {
      ...company.site,
      siteName: envSiteName?.trim() || company.site.siteName,
      logoUrl: envLogoUrl?.trim() || company.site.logoUrl,
      theme: loadTheme(),
      seo: loadSeo(),
    };
  }
  return {
    siteName: (process.env.NEXT_PUBLIC_ORG_NAME ||
      process.env.ORG_NAME ||
      "Your Company Blog") as string,
    heroTitle: "Insights and stories from our team",
    heroSubtitle:
      "Thought leadership, case studies, and best practices to help you grow.",
    aboutText:
      "We are a team of experts passionate about helping businesses succeed.",
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
  const cfg = company?.theme || (company as any)?.site?.theme || {};
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
  const seo = company?.seo || {};
  return seo;
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
