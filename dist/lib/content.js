import { unstable_noStore as noStore } from "next/cache";
import { fetchPostBySlug, fetchPublishedPosts } from "./posts";
import { getBrandConfig } from "./brand-config";
export function loadSite() {
    const brand = getBrandConfig();
    const siteBlock = brand.site || {};
    // Prioritize environment variables for runtime personalization
    const envSiteName = process.env.NEXT_PUBLIC_ORG_NAME || process.env.ORG_NAME;
    const envLogoUrl = process.env.NEXT_PUBLIC_ORG_LOGO_URL || process.env.ORG_LOGO_URL;
    // Use environment variables first, then fall back to the brand config, then defaults
    const siteName = (envSiteName === null || envSiteName === void 0 ? void 0 : envSiteName.trim()) || siteBlock.siteName || "Your Company Blog";
    const logoUrl = (envLogoUrl === null || envLogoUrl === void 0 ? void 0 : envLogoUrl.trim()) || siteBlock.logoUrl;
    const heroTitle = siteBlock.heroTitle || `Insights and stories from the ${siteName} team`;
    const heroSubtitle = siteBlock.heroSubtitle ||
        "Thought leadership, case studies, and best practices to help you grow.";
    const aboutText = siteBlock.aboutText ||
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
export function loadTheme() {
    var _a, _b, _c, _d, _e, _f;
    const brand = getBrandConfig();
    const cfg = brand.theme || ((_a = brand.site) === null || _a === void 0 ? void 0 : _a.theme) || {};
    const envPrimary = process.env.NEXT_PUBLIC_PRIMARY_COLOR;
    const envSecondary = process.env.NEXT_PUBLIC_SECONDARY_COLOR;
    const envTertiary = process.env.NEXT_PUBLIC_TERTIARY_COLOR;
    const envBackground = process.env.NEXT_PUBLIC_BACKGROUND_COLOR;
    const envForeground = process.env.NEXT_PUBLIC_FOREGROUND_COLOR;
    return {
        colors: {
            primary: envPrimary || ((_b = cfg.colors) === null || _b === void 0 ? void 0 : _b.primary),
            secondary: envSecondary || ((_c = cfg.colors) === null || _c === void 0 ? void 0 : _c.secondary),
            tertiary: envTertiary || ((_d = cfg.colors) === null || _d === void 0 ? void 0 : _d.tertiary),
            background: envBackground || ((_e = cfg.colors) === null || _e === void 0 ? void 0 : _e.background),
            foreground: envForeground || ((_f = cfg.colors) === null || _f === void 0 ? void 0 : _f.foreground),
        },
    };
}
export function loadSeo() {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const brand = getBrandConfig();
    // Prioritize environment variables for SEO
    const envTitle = process.env.NEXT_PUBLIC_SEO_TITLE;
    const envDescription = process.env.NEXT_PUBLIC_SEO_DESCRIPTION;
    const envKeywords = process.env.NEXT_PUBLIC_SEO_KEYWORDS;
    return {
        title: envTitle || ((_a = brand.seo) === null || _a === void 0 ? void 0 : _a.title) || ((_c = (_b = brand.site) === null || _b === void 0 ? void 0 : _b.seo) === null || _c === void 0 ? void 0 : _c.title),
        description: envDescription ||
            ((_d = brand.seo) === null || _d === void 0 ? void 0 : _d.description) ||
            ((_f = (_e = brand.site) === null || _e === void 0 ? void 0 : _e.seo) === null || _f === void 0 ? void 0 : _f.description),
        keywords: envKeywords || ((_g = brand.seo) === null || _g === void 0 ? void 0 : _g.keywords) || ((_j = (_h = brand.site) === null || _h === void 0 ? void 0 : _h.seo) === null || _j === void 0 ? void 0 : _j.keywords),
    };
}
function resolveTenantId() {
    var _a, _b;
    const explicit = (_a = process.env.BLOG_TENANT_ID) === null || _a === void 0 ? void 0 : _a.trim();
    if (explicit)
        return explicit;
    const publicId = (_b = process.env.NEXT_PUBLIC_BLOG_TENANT_ID) === null || _b === void 0 ? void 0 : _b.trim();
    if (publicId)
        return publicId;
    return null;
}
function fallbackExcerpt(content, maxLen = 180) {
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
function recordToPost(record) {
    const metadata = record.metadata || {};
    const category = typeof metadata.category === "string" && metadata.category.trim().length
        ? metadata.category
        : undefined;
    const imageUrl = typeof metadata.imageUrl === "string" && metadata.imageUrl.trim().length
        ? metadata.imageUrl
        : undefined;
    const author = typeof metadata.author === "string" && metadata.author.trim().length
        ? metadata.author
        : "Editorial Team";
    const excerpt = (record.excerpt && record.excerpt.trim().length > 0
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
export async function loadPosts() {
    noStore();
    const tenantId = resolveTenantId();
    if (!tenantId) {
        console.warn("[content] BLOG_TENANT_ID is not configured; returning empty post list.");
        return [];
    }
    const records = await fetchPublishedPosts(tenantId);
    return records.map(recordToPost);
}
export async function loadPostBySlug(slug) {
    noStore();
    const tenantId = resolveTenantId();
    if (!tenantId) {
        console.warn("[content] BLOG_TENANT_ID is not configured; cannot load post.");
        return null;
    }
    const record = await fetchPostBySlug(tenantId, slug);
    return record ? recordToPost(record) : null;
}
