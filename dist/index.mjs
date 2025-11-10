import React from "react";
// Next.js font loaders - must remain as const declarations

// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

// src/lib/content.ts
import { unstable_noStore as noStore } from "next/cache";

// src/lib/db.ts
import fs from "fs";
import path from "path";
import mysql from "mysql2/promise";
var pool = null;
function readEnv(name) {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(
      `[cosmos-db] Missing required environment variable ${name}.`
    );
  }
  return value.trim();
}
function parsePort(raw) {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) {
    throw new Error(
      `[cosmos-db] Expected COSMOS_MYSQL_PORT to be a number, received "${raw}".`
    );
  }
  return parsed;
}
function resolveSslOptions() {
  var _a;
  const sslMode = (process.env.COSMOS_MYSQL_SSL || "required").toLowerCase();
  if (["skip", "disabled", "false", "off"].includes(sslMode)) {
    return void 0;
  }
  const certSource = (_a = process.env.COSMOS_MYSQL_CA_CERT) == null ? void 0 : _a.trim();
  if (!certSource) {
    return { rejectUnauthorized: true };
  }
  if (certSource.includes("BEGIN CERTIFICATE")) {
    return { ca: certSource };
  }
  const resolved = path.isAbsolute(certSource) ? certSource : path.join(process.cwd(), certSource);
  if (!fs.existsSync(resolved)) {
    throw new Error(
      `[cosmos-db] COSMOS_MYSQL_CA_CERT file not found at ${resolved}.`
    );
  }
  return { ca: fs.readFileSync(resolved, "utf8") };
}
function createPool() {
  const host = readEnv("COSMOS_MYSQL_HOST");
  const port = parsePort(readEnv("COSMOS_MYSQL_PORT"));
  const user = readEnv("COSMOS_MYSQL_USERNAME");
  const password = readEnv("COSMOS_MYSQL_PASSWORD");
  const database = readEnv("COSMOS_MYSQL_DATABASE");
  const options = {
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: Number(process.env.COSMOS_MYSQL_POOL_MAX || 10),
    queueLimit: 0,
    ssl: resolveSslOptions()
  };
  return mysql.createPool(options);
}
function getPool() {
  if (!pool) {
    pool = createPool();
  }
  return pool;
}
async function withConnection(handler) {
  const activePool = getPool();
  const connection = await activePool.getConnection();
  try {
    return await handler(connection);
  } finally {
    connection.release();
  }
}

// src/lib/posts.ts
var SELECT_COLUMNS = [
  "id",
  "organization_id",
  "slug",
  "status",
  "title",
  "content",
  "excerpt",
  "url",
  "metadata",
  "created_at",
  "updated_at",
  "published_at"
].join(", ");
function parseMetadata(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
}
function toRecord(row) {
  return {
    id: row.id,
    organizationId: row.organization_id,
    slug: row.slug,
    status: row.status,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    url: row.url,
    metadata: parseMetadata(row.metadata),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    publishedAt: row.published_at ? row.published_at.toISOString() : null
  };
}
async function fetchPublishedPosts(organizationId, limit = 100) {
  return withConnection(async (connection) => {
    const limitInt = Math.max(1, Math.floor(Number(limit) || 100));
    const [rows] = await connection.execute(
      `
        SELECT ${SELECT_COLUMNS}
        FROM posts
        WHERE organization_id = ?
          AND status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        LIMIT ?
      `,
      [organizationId, limitInt]
    );
    return rows.map(toRecord);
  });
}
async function fetchPostBySlug(organizationId, slug) {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute(
      `
        SELECT ${SELECT_COLUMNS}
        FROM posts
        WHERE organization_id = ?
          AND slug = ?
          AND status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        LIMIT 1
      `,
      [organizationId, slug]
    );
    if (!rows.length) return null;
    return toRecord(rows[0]);
  });
}

// src/lib/brand-config.ts
var runtimeConfig = null;
var warnedAboutMissingConfig = false;
function cloneConfig(config) {
  try {
    return structuredClone(config);
  } catch (e) {
    return JSON.parse(JSON.stringify(config));
  }
}
function initializeBrandConfig(config) {
  runtimeConfig = cloneConfig(config);
  warnedAboutMissingConfig = false;
}
function defaultBrandConfig() {
  return {
    site: {}
  };
}
function getBrandConfig() {
  if (!runtimeConfig) {
    if (!warnedAboutMissingConfig) {
      console.warn(
        "[brand-config] No runtime brand configuration detected; falling back to defaults."
      );
      warnedAboutMissingConfig = true;
    }
    runtimeConfig = defaultBrandConfig();
  }
  return runtimeConfig;
}
function defineBrandConfig(config) {
  return config;
}

// src/lib/content.ts
function loadSite() {
  const brand = getBrandConfig();
  const siteBlock = brand.site || {};
  const envSiteName = process.env.NEXT_PUBLIC_ORG_NAME || process.env.ORG_NAME;
  const envLogoUrl = process.env.NEXT_PUBLIC_ORG_LOGO_URL || process.env.ORG_LOGO_URL;
  const siteName = (envSiteName == null ? void 0 : envSiteName.trim()) || siteBlock.siteName || "Your Company Blog";
  const logoUrl = (envLogoUrl == null ? void 0 : envLogoUrl.trim()) || siteBlock.logoUrl;
  const heroTitle = siteBlock.heroTitle || `Insights and stories from the ${siteName} team`;
  const heroSubtitle = siteBlock.heroSubtitle || "Thought leadership, case studies, and best practices to help you grow.";
  const aboutText = siteBlock.aboutText || "We are a team of experts passionate about helping businesses succeed.";
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
    seo: loadSeo()
  };
}
function loadTheme() {
  var _a, _b, _c, _d, _e, _f;
  const brand = getBrandConfig();
  const cfg = brand.theme || ((_a = brand.site) == null ? void 0 : _a.theme) || {};
  const envPrimary = process.env.NEXT_PUBLIC_PRIMARY_COLOR;
  const envSecondary = process.env.NEXT_PUBLIC_SECONDARY_COLOR;
  const envTertiary = process.env.NEXT_PUBLIC_TERTIARY_COLOR;
  const envBackground = process.env.NEXT_PUBLIC_BACKGROUND_COLOR;
  const envForeground = process.env.NEXT_PUBLIC_FOREGROUND_COLOR;
  return {
    colors: {
      primary: envPrimary || ((_b = cfg.colors) == null ? void 0 : _b.primary),
      secondary: envSecondary || ((_c = cfg.colors) == null ? void 0 : _c.secondary),
      tertiary: envTertiary || ((_d = cfg.colors) == null ? void 0 : _d.tertiary),
      background: envBackground || ((_e = cfg.colors) == null ? void 0 : _e.background),
      foreground: envForeground || ((_f = cfg.colors) == null ? void 0 : _f.foreground)
    }
  };
}
function loadSeo() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const brand = getBrandConfig();
  const envTitle = process.env.NEXT_PUBLIC_SEO_TITLE;
  const envDescription = process.env.NEXT_PUBLIC_SEO_DESCRIPTION;
  const envKeywords = process.env.NEXT_PUBLIC_SEO_KEYWORDS;
  return {
    title: envTitle || ((_a = brand.seo) == null ? void 0 : _a.title) || ((_c = (_b = brand.site) == null ? void 0 : _b.seo) == null ? void 0 : _c.title),
    description: envDescription || ((_d = brand.seo) == null ? void 0 : _d.description) || ((_f = (_e = brand.site) == null ? void 0 : _e.seo) == null ? void 0 : _f.description),
    keywords: envKeywords || ((_g = brand.seo) == null ? void 0 : _g.keywords) || ((_i = (_h = brand.site) == null ? void 0 : _h.seo) == null ? void 0 : _i.keywords)
  };
}
function resolveTenantId() {
  var _a, _b;
  const explicit = (_a = process.env.BLOG_TENANT_ID) == null ? void 0 : _a.trim();
  if (explicit) return explicit;
  const publicId = (_b = process.env.NEXT_PUBLIC_BLOG_TENANT_ID) == null ? void 0 : _b.trim();
  if (publicId) return publicId;
  return null;
}
function fallbackExcerpt(content, maxLen = 180) {
  const plainText = content.replace(/```[\s\S]*?```/g, " ").replace(/`[^`]*`/g, " ").replace(/[#>*_`\-]/g, " ").split("\n").map((line) => line.trim()).filter(Boolean).join(" ");
  return plainText.slice(0, maxLen).trim();
}
function recordToPost(record) {
  const metadata = record.metadata || {};
  const category = typeof metadata.category === "string" && metadata.category.trim().length ? metadata.category : void 0;
  const imageUrl = typeof metadata.imageUrl === "string" && metadata.imageUrl.trim().length ? metadata.imageUrl : void 0;
  const author = typeof metadata.author === "string" && metadata.author.trim().length ? metadata.author : "Editorial Team";
  const excerpt = (record.excerpt && record.excerpt.trim().length > 0 ? record.excerpt : fallbackExcerpt(record.content)) || "";
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
    url: record.url
  };
}
async function loadPosts() {
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
async function loadPostBySlug(slug) {
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

// src/app/layout.tsx
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});
function generateMetadata() {
  const site = loadSite();
  const seo = site.seo || loadSeo();
  return {
    title: (seo == null ? void 0 : seo.title) || site.siteName,
    description: (seo == null ? void 0 : seo.description) || site.heroSubtitle,
    keywords: (seo == null ? void 0 : seo.keywords) ? Array.isArray(seo.keywords) ? seo.keywords : [seo.keywords] : void 0
  };
}
function RootLayout({
  children
}) {
  var _a, _b, _c, _d, _e;
  const theme = loadTheme();
  const styleVars = {
    "--primary": process.env.NEXT_PUBLIC_PRIMARY_COLOR || ((_a = theme == null ? void 0 : theme.colors) == null ? void 0 : _a.primary),
    "--secondary": process.env.NEXT_PUBLIC_SECONDARY_COLOR || ((_b = theme == null ? void 0 : theme.colors) == null ? void 0 : _b.secondary),
    "--tertiary": process.env.NEXT_PUBLIC_TERTIARY_COLOR || ((_c = theme == null ? void 0 : theme.colors) == null ? void 0 : _c.tertiary),
    "--background": process.env.NEXT_PUBLIC_BACKGROUND_COLOR || ((_d = theme == null ? void 0 : theme.colors) == null ? void 0 : _d.background),
    "--foreground": process.env.NEXT_PUBLIC_FOREGROUND_COLOR || ((_e = theme == null ? void 0 : theme.colors) == null ? void 0 : _e.foreground)
  };
  return /* @__PURE__ */ React.createElement("html", { lang: "en" }, /* @__PURE__ */ React.createElement(
    "body",
    {
      className: `${geistSans.variable} ${geistMono.variable} antialiased`,
      style: styleVars
    },
    children
  ));
}

// src/app/page.tsx
import Link5 from "next/link";

// src/components/Header.tsx
import Link from "next/link";
import { useState, useEffect } from "react";
function Header({ siteName, logoUrl }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const isValidImageSrc = (src) => {
    if (!src) return false;
    return /^https?:\/\//.test(src) || src.startsWith("/");
  };
  return /* @__PURE__ */ React.createElement(
    "header",
    {
      className: `sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "glass shadow-lg backdrop-blur-md" : "bg-[color:var(--background)] border-b border-theme"}`
    },
    /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between h-16" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "relative h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary overflow-hidden flex items-center justify-center shadow-md" }, isValidImageSrc(logoUrl) ? (
      // eslint-disable-next-line @next/next/no-img-element
      /* @__PURE__ */ React.createElement(
        "img",
        {
          src: logoUrl,
          alt: siteName,
          className: "h-8 w-8 object-contain rounded-full"
        }
      )
    ) : /* @__PURE__ */ React.createElement("span", { className: "text-white font-bold text-sm" }, siteName.charAt(0).toUpperCase())), /* @__PURE__ */ React.createElement(
      Link,
      {
        href: "/",
        className: "text-xl font-bold tracking-tight text-primary hover:text-primary-hover transition-colors duration-200"
      },
      siteName
    )), /* @__PURE__ */ React.createElement("nav", { className: "hidden md:flex items-center gap-8" }, /* @__PURE__ */ React.createElement(
      Link,
      {
        href: "/",
        className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
      },
      "Home",
      /* @__PURE__ */ React.createElement("span", { className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" })
    ), /* @__PURE__ */ React.createElement(
      Link,
      {
        href: "/posts",
        className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 relative group"
      },
      "Articles",
      /* @__PURE__ */ React.createElement("span", { className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-200 group-hover:w-full" })
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200",
        onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen),
        "aria-label": "Toggle mobile menu"
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 relative" }, /* @__PURE__ */ React.createElement(
        "span",
        {
          className: `absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "rotate-45 top-3" : "top-1"}`
        }
      ), /* @__PURE__ */ React.createElement(
        "span",
        {
          className: `absolute block h-0.5 w-6 bg-current transition-all duration-300 top-3 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`
        }
      ), /* @__PURE__ */ React.createElement(
        "span",
        {
          className: `absolute block h-0.5 w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? "-rotate-45 top-3" : "top-5"}`
        }
      ))
    )), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-48 opacity-100 pb-4" : "max-h-0 opacity-0 overflow-hidden"}`
      },
      /* @__PURE__ */ React.createElement("nav", { className: "flex flex-col gap-4 pt-4 border-t border-theme" }, /* @__PURE__ */ React.createElement(
        Link,
        {
          href: "/",
          className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2",
          onClick: () => setIsMobileMenuOpen(false)
        },
        "Home"
      ), /* @__PURE__ */ React.createElement(
        Link,
        {
          href: "/posts",
          className: "text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200 py-2",
          onClick: () => setIsMobileMenuOpen(false)
        },
        "Articles"
      ))
    ))
  );
}
var Header_default = Header;

// src/components/Hero.tsx
import Link2 from "next/link";
function Hero({ title, subtitle, imageUrl }) {
  return /* @__PURE__ */ React.createElement("section", { className: "relative overflow-hidden bg-gradient-to-br from-background via-muted to-background" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-grid-pattern opacity-5" }), /* @__PURE__ */ React.createElement("div", { className: "relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32" }, /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-2 gap-12 lg:gap-16 items-center" }, /* @__PURE__ */ React.createElement("div", { className: "animate-fadeInUp" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "w-2 h-2 rounded-full bg-primary animate-pulse" }), "Welcome to our blog"), /* @__PURE__ */ React.createElement("h1", { className: "heading-1 text-gradient mb-6" }, title), /* @__PURE__ */ React.createElement("p", { className: "body-large text-muted-foreground mb-8 max-w-2xl" }, subtitle), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-4" }, /* @__PURE__ */ React.createElement(Link2, { href: "/posts", className: "btn btn-primary btn-lg group" }, /* @__PURE__ */ React.createElement("span", null, "Explore Articles"), /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-5 h-5 ml-2 transition-transform group-hover:translate-x-1",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M17 8l4 4m0 0l-4 4m4-4H3"
      }
    )
  )), /* @__PURE__ */ React.createElement(Link2, { href: "#featured", className: "btn btn-secondary btn-lg group" }, /* @__PURE__ */ React.createElement("span", null, "Latest Posts"), /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-5 h-5 ml-2 transition-transform group-hover:translate-y-1",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M19 14l-7 7m0 0l-7-7m7 7V3"
      }
    )
  ))), /* @__PURE__ */ React.createElement("div", { className: "mt-12 grid grid-cols-3 gap-8 pt-8 border-t border-theme" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-primary mb-1" }, "100+"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground" }, "Articles")), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-primary mb-1" }, "50K+"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground" }, "Readers")), /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold text-primary mb-1" }, "Weekly"), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground" }, "Updates")))), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "relative animate-fadeInUp",
      style: { animationDelay: "0.2s" }
    },
    /* @__PURE__ */ React.createElement("div", { className: "relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl" }, imageUrl ? /* @__PURE__ */ React.createElement("div", { className: "relative h-full w-full bg-gradient-to-br from-primary/20 to-secondary/20" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: imageUrl,
        alt: "",
        className: "image-cover rounded-2xl"
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" })) : /* @__PURE__ */ React.createElement("div", { className: "h-full w-full bg-gradient-to-br from-primary via-secondary to-tertiary flex items-center justify-center rounded-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "text-white text-center" }, /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-16 h-16 mx-auto mb-4 opacity-80",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1.5,
          d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
        }
      )
    ), /* @__PURE__ */ React.createElement("p", { className: "text-lg font-medium opacity-90" }, "Your Blog Stories")))),
    /* @__PURE__ */ React.createElement("div", { className: "absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse" }),
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "absolute -bottom-8 -left-8 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse",
        style: { animationDelay: "1s" }
      }
    )
  ))));
}
var Hero_default = Hero;

// src/components/Footer.tsx
import Link3 from "next/link";
function Footer({ siteName }) {
  const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
  return /* @__PURE__ */ React.createElement("footer", { className: "border-t border-theme bg-muted/20" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "py-12 grid grid-cols-1 md:grid-cols-4 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "md:col-span-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "h-8 w-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-white font-bold text-sm" }, siteName.charAt(0).toUpperCase())), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-primary" }, siteName)), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mb-6 max-w-md" }, "Sharing insights, stories, and knowledge to help you stay informed and inspired. Join our community of readers exploring the latest trends and ideas."), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center",
      "aria-label": "Twitter"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-5 h-5",
        fill: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
    )
  ), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center",
      "aria-label": "LinkedIn"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-5 h-5",
        fill: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" })
    )
  ), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-white transition-all duration-200 flex items-center justify-center",
      "aria-label": "GitHub"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-5 h-5",
        fill: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement("path", { d: "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" })
    )
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold mb-4" }, "Quick Links"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    Link3,
    {
      href: "/",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "Home"
  )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    Link3,
    {
      href: "/posts",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "All Articles"
  )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "About"
  )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "Contact"
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold mb-4" }, "Legal"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "Privacy Policy"
  )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "Terms of Service"
  )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "Cookie Policy"
  )), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "#",
      className: "text-muted-foreground hover:text-primary transition-colors"
    },
    "Disclaimer"
  ))))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-theme py-6 flex flex-col sm:flex-row items-center justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground" }, "\xA9 ", currentYear, " ", siteName, ". All rights reserved."), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-6 text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, "Made with \u2764\uFE0F for our readers"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement("span", null, "Powered by"), /* @__PURE__ */ React.createElement(
    "a",
    {
      href: "https://nextjs.org",
      className: "text-primary hover:underline font-medium",
      target: "_blank",
      rel: "noopener noreferrer"
    },
    "Next.js"
  ))))));
}
var Footer_default = Footer;

// src/components/PostCard.tsx
import Link4 from "next/link";
function PostCard({
  post,
  featured = false,
  variant = "default"
}) {
  var _a;
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return "Recently";
    }
  };
  const readingTime = Math.max(
    1,
    Math.ceil((((_a = post.content) == null ? void 0 : _a.length) || 0) / 1e3)
  );
  if (variant === "horizontal") {
    return /* @__PURE__ */ React.createElement(
      Link4,
      {
        href: `/posts/${post.slug}`,
        className: "card group flex flex-col sm:flex-row gap-6 overflow-hidden"
      },
      /* @__PURE__ */ React.createElement("div", { className: "relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden" }, post.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        /* @__PURE__ */ React.createElement("img", { src: post.imageUrl, alt: "", className: "image-cover" })
      ) : /* @__PURE__ */ React.createElement("div", { className: "h-full w-full bg-gradient-to-br from-muted to-muted-dark flex items-center justify-center" }, /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: "w-12 h-12 text-muted-foreground",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          }
        )
      ))),
      /* @__PURE__ */ React.createElement("div", { className: "card-content flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-3" }, post.category && /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary" }, post.category), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, formatDate(post.publishedAt)), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, readingTime, " min read")), /* @__PURE__ */ React.createElement("h3", { className: "heading-4 mb-3 group-hover:text-primary transition-colors line-clamp-2" }, post.title), /* @__PURE__ */ React.createElement("p", { className: "body-medium text-muted-foreground mb-4 line-clamp-3" }, post.excerpt), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, post.author && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary" }, post.author.charAt(0).toUpperCase()), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, post.author)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all" }, /* @__PURE__ */ React.createElement("span", null, "Read more"), /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: "w-4 h-4 transition-transform group-hover:translate-x-1",
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M17 8l4 4m0 0l-4 4m4-4H3"
          }
        )
      ))))
    );
  }
  if (variant === "minimal") {
    return /* @__PURE__ */ React.createElement(
      Link4,
      {
        href: `/posts/${post.slug}`,
        className: "group block py-4 border-b border-theme hover:bg-muted/50 transition-colors px-4 -mx-4"
      },
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, post.category && /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-primary" }, post.category), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-muted-foreground" }, formatDate(post.publishedAt))),
      /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1" }, post.title),
      /* @__PURE__ */ React.createElement("p", { className: "text-sm text-muted-foreground line-clamp-2 mb-2" }, post.excerpt),
      /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-sm" }, post.author && /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground" }, post.author), /* @__PURE__ */ React.createElement("span", { className: "text-muted-foreground" }, readingTime, " min read"))
    );
  }
  return /* @__PURE__ */ React.createElement(
    Link4,
    {
      href: `/posts/${post.slug}`,
      className: `card group block overflow-hidden ${featured ? "md:col-span-2 md:row-span-2" : ""}`
    },
    /* @__PURE__ */ React.createElement(
      "div",
      {
        className: `relative w-full bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden ${featured ? "h-64 md:h-80" : "h-48"}`
      },
      post.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        /* @__PURE__ */ React.createElement("img", { src: post.imageUrl, alt: "", className: "image-cover" })
      ) : /* @__PURE__ */ React.createElement("div", { className: "h-full w-full bg-gradient-to-br from-muted to-muted-dark flex items-center justify-center" }, /* @__PURE__ */ React.createElement(
        "svg",
        {
          className: `text-muted-foreground ${featured ? "w-16 h-16" : "w-12 h-12"}`,
          fill: "none",
          stroke: "currentColor",
          viewBox: "0 0 24 24"
        },
        /* @__PURE__ */ React.createElement(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 1.5,
            d: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          }
        )
      )),
      /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" }, /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 left-4 right-4" }, post.category && /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white" }, post.category)))
    ),
    /* @__PURE__ */ React.createElement("div", { className: "card-content" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-3 text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, formatDate(post.publishedAt)), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, readingTime, " min read")), /* @__PURE__ */ React.createElement(
      "h3",
      {
        className: `font-bold group-hover:text-primary transition-colors line-clamp-2 mb-3 ${featured ? "text-xl md:text-2xl" : "text-lg"}`
      },
      post.title
    ), /* @__PURE__ */ React.createElement(
      "p",
      {
        className: `text-muted-foreground line-clamp-3 mb-4 ${featured ? "text-base" : "text-sm"}`
      },
      post.excerpt
    ), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, post.author && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary" }, post.author.charAt(0).toUpperCase()), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, post.author)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all" }, /* @__PURE__ */ React.createElement("span", null, "Read more"), /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-4 h-4 transition-transform group-hover:translate-x-1",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M17 8l4 4m0 0l-4 4m4-4H3"
        }
      )
    ))))
  );
}
var PostCard_default = PostCard;

// src/app/page.tsx
var dynamic = "force-dynamic";
var revalidate = 0;
async function Home() {
  const siteData = loadSite();
  const postsData = await loadPosts();
  const latestPosts = [...postsData].sort((a, b) => {
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    return tb - ta;
  });
  const featuredPost = latestPosts[0];
  const recentPosts = latestPosts.slice(1, 7);
  const categories = [
    ...new Set(
      postsData.map((post) => post.category).filter((category) => Boolean(category))
    )
  ];
  return /* @__PURE__ */ React.createElement("main", { className: "min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]" }, /* @__PURE__ */ React.createElement(Header_default, { siteName: siteData.siteName, logoUrl: siteData.logoUrl }), /* @__PURE__ */ React.createElement(
    Hero_default,
    {
      title: siteData.heroTitle,
      subtitle: siteData.heroSubtitle,
      imageUrl: siteData.heroImageUrl
    }
  ), featuredPost && /* @__PURE__ */ React.createElement("section", { id: "featured", className: "py-16 bg-muted/30" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-12" }, /* @__PURE__ */ React.createElement("h2", { className: "heading-2 mb-4" }, "Featured Article"), /* @__PURE__ */ React.createElement("p", { className: "body-large text-muted-foreground max-w-2xl mx-auto" }, "Dive into our latest and most engaging content")), /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement(PostCard_default, { post: featuredPost, variant: "horizontal" })))), /* @__PURE__ */ React.createElement("section", { className: "py-16" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-12" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "heading-2 mb-4" }, "Latest Articles"), /* @__PURE__ */ React.createElement("p", { className: "body-large text-muted-foreground" }, "Stay updated with our newest insights and stories")), postsData.length > 6 && /* @__PURE__ */ React.createElement(
    Link5,
    {
      href: "/posts",
      className: "btn btn-ghost btn-md group hidden sm:inline-flex"
    },
    /* @__PURE__ */ React.createElement("span", null, "View All"),
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-4 h-4 ml-2 transition-transform group-hover:translate-x-1",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M17 8l4 4m0 0l-4 4m4-4H3"
        }
      )
    )
  )), /* @__PURE__ */ React.createElement("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3" }, recentPosts.map((post, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: post.slug,
      className: "animate-fadeInUp",
      style: { animationDelay: `${index * 0.1}s` }
    },
    /* @__PURE__ */ React.createElement(PostCard_default, { post })
  ))), postsData.length > 6 && /* @__PURE__ */ React.createElement("div", { className: "text-center mt-12" }, /* @__PURE__ */ React.createElement(
    Link5,
    {
      href: "/posts",
      className: "btn btn-primary btn-lg group sm:hidden"
    },
    /* @__PURE__ */ React.createElement("span", null, "View All Articles"),
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-5 h-5 ml-2 transition-transform group-hover:translate-x-1",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M17 8l4 4m0 0l-4 4m4-4H3"
        }
      )
    )
  )))), categories.length > 0 && /* @__PURE__ */ React.createElement("section", { className: "py-16 bg-muted/30" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-12" }, /* @__PURE__ */ React.createElement("h2", { className: "heading-2 mb-4" }, "Explore by Category"), /* @__PURE__ */ React.createElement("p", { className: "body-large text-muted-foreground max-w-2xl mx-auto" }, "Discover content tailored to your interests")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-4" }, categories.map((category) => {
    const categoryPosts = postsData.filter(
      (post) => post.category === category
    );
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        key: category,
        href: `/posts?category=${encodeURIComponent(category)}`,
        className: "group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-theme bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200"
      },
      /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, category),
      /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full" }, categoryPosts.length)
    );
  })))), /* @__PURE__ */ React.createElement("section", { className: "py-16 bg-gradient-to-r from-primary to-secondary" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center" }, /* @__PURE__ */ React.createElement("h2", { className: "heading-2 text-white mb-4" }, "Stay Updated"), /* @__PURE__ */ React.createElement("p", { className: "body-large text-white/90 mb-8 max-w-2xl mx-auto" }, "Get the latest articles and insights delivered straight to your inbox. Join our community of readers who stay ahead of the curve."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 max-w-md mx-auto" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      placeholder: "Enter your email",
      className: "flex-1 px-4 py-3 rounded-lg border-0 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
    }
  ), /* @__PURE__ */ React.createElement("button", { className: "btn bg-white text-primary hover:bg-white/90 btn-md font-semibold" }, "Subscribe")), /* @__PURE__ */ React.createElement("p", { className: "text-white/70 text-sm mt-4" }, "No spam, unsubscribe at any time"))), /* @__PURE__ */ React.createElement(Footer_default, { siteName: siteData.siteName }));
}

// src/components/PostsIndexClient.tsx
import { useMemo, useState as useState2 } from "react";
function PostsIndexClient({ site, posts }) {
  const [searchTerm, setSearchTerm] = useState2("");
  const [selectedCategory, setSelectedCategory] = useState2("all");
  const [viewMode, setViewMode] = useState2("grid");
  const categories = useMemo(() => {
    const cats = [
      ...new Set(posts.map((post) => post.category).filter(Boolean))
    ];
    return ["all", ...cats];
  }, [posts]);
  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) => {
          var _a, _b;
          return post.title.toLowerCase().includes(term) || post.excerpt.toLowerCase().includes(term) || ((_a = post.author) == null ? void 0 : _a.toLowerCase().includes(term)) || ((_b = post.category) == null ? void 0 : _b.toLowerCase().includes(term));
        }
      );
    }
    return filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [posts, searchTerm, selectedCategory]);
  return /* @__PURE__ */ React.createElement("main", { className: "min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]" }, /* @__PURE__ */ React.createElement(Header_default, { siteName: site.siteName, logoUrl: site.logoUrl }), /* @__PURE__ */ React.createElement("section", { className: "bg-gradient-to-br from-background via-muted/50 to-background py-16" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("h1", { className: "heading-1 mb-6" }, "All Articles"), /* @__PURE__ */ React.createElement("p", { className: "body-large text-muted-foreground max-w-2xl mx-auto mb-8" }, "Explore our complete collection of insights, tutorials, and stories. Find exactly what you're looking for with our search and filtering tools."), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2 text-sm text-muted-foreground" }, /* @__PURE__ */ React.createElement("span", null, posts.length, " articles"), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, categories.length - 1, " categories"))))), /* @__PURE__ */ React.createElement("section", { className: "border-b border-theme bg-card" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1 max-w-md" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "h-5 w-5 text-muted-foreground",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      }
    )
  )), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "Search articles...",
      value: searchTerm,
      onChange: (e) => setSearchTerm(e.target.value),
      className: "block w-full pl-10 pr-3 py-2 border border-theme rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("label", { className: "text-sm font-medium text-muted-foreground" }, "Category:"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: selectedCategory,
      onChange: (e) => setSelectedCategory(e.target.value),
      className: "px-3 py-2 border border-theme rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
    },
    categories.map((category) => /* @__PURE__ */ React.createElement("option", { key: category, value: category }, category === "all" ? "All Categories" : category))
  )), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 p-1 bg-muted rounded-lg" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setViewMode("grid"),
      className: `p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`,
      "aria-label": "Grid view"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        }
      )
    )
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setViewMode("list"),
      className: `p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`,
      "aria-label": "List view"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-4 h-4",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M4 6h16M4 10h16M4 14h16M4 18h16"
        }
      )
    )
  )))), (searchTerm || selectedCategory !== "all") && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mt-4 pt-4 border-t border-theme" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, "Active filters:"), searchTerm && /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm" }, /* @__PURE__ */ React.createElement("span", null, 'Search: "', searchTerm, '"'), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setSearchTerm(""),
      className: "ml-1 hover:bg-primary/20 rounded-full p-0.5"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-3 h-3",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M6 18L18 6M6 6l12 12"
        }
      )
    )
  )), selectedCategory !== "all" && /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm" }, /* @__PURE__ */ React.createElement("span", null, "Category: ", selectedCategory), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setSelectedCategory("all"),
      className: "ml-1 hover:bg-secondary/20 rounded-full p-0.5"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-3 h-3",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M6 18L18 6M6 6l12 12"
        }
      )
    )
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setSearchTerm("");
        setSelectedCategory("all");
      },
      className: "text-sm text-muted-foreground hover:text-foreground underline"
    },
    "Clear all"
  )))), /* @__PURE__ */ React.createElement("section", { className: "py-12" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, filteredPosts.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-16" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-8 h-8 text-muted-foreground",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 6.5a3 3 0 11-6 0 3 3 0 016 0z"
      }
    )
  )), /* @__PURE__ */ React.createElement("h3", { className: "heading-3 mb-2" }, "No articles found"), /* @__PURE__ */ React.createElement("p", { className: "text-muted-foreground mb-4" }, "Try adjusting your search or filter criteria"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setSearchTerm("");
        setSelectedCategory("all");
      },
      className: "btn btn-primary btn-md"
    },
    "Clear filters"
  )) : viewMode === "grid" ? /* @__PURE__ */ React.createElement("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3" }, filteredPosts.map((post, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: post.slug,
      className: "animate-fadeInUp",
      style: { animationDelay: `${index * 0.05}s` }
    },
    /* @__PURE__ */ React.createElement(PostCard_default, { post })
  ))) : /* @__PURE__ */ React.createElement("div", { className: "space-y-0" }, filteredPosts.map((post, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: post.slug,
      className: "animate-fadeInUp",
      style: { animationDelay: `${index * 0.03}s` }
    },
    /* @__PURE__ */ React.createElement(PostCard_default, { post, variant: "minimal" })
  ))))), /* @__PURE__ */ React.createElement(Footer_default, { siteName: site.siteName }));
}

// src/app/posts/page.tsx
var dynamic2 = "force-dynamic";
var revalidate2 = 0;
async function PostsIndexPage() {
  const site = loadSite();
  const posts = await loadPosts();
  return /* @__PURE__ */ React.createElement(PostsIndexClient, { site, posts });
}

// src/app/posts/[slug]/page.tsx
import { notFound } from "next/navigation";

// src/components/Markdown.tsx
import React2 from "react";
function Markdown({ content }) {
  const lines = content.split("\n");
  let inCodeBlock = false;
  let inQuoteBlock = false;
  let codeBlockContent = [];
  let quoteBlockContent = [];
  const elements = [];
  const processInlineFormatting = (text) => {
    text = text.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold">$1</strong>'
    );
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    text = text.replace(
      /`([^`]+)`/g,
      '<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'
    );
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-primary hover:underline">$1</a>'
    );
    return text;
  };
  lines.forEach((line, index) => {
    var _a;
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        const language = ((_a = codeBlockContent[0]) == null ? void 0 : _a.replace("```", "").trim()) || "text";
        const code = codeBlockContent.slice(1).join("\n");
        elements.push(
          /* @__PURE__ */ React2.createElement("div", { key: index, className: "my-6" }, /* @__PURE__ */ React2.createElement("div", { className: "bg-muted/50 border border-theme rounded-t-lg px-4 py-2 text-sm font-medium text-muted-foreground" }, language), /* @__PURE__ */ React2.createElement("pre", { className: "bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto" }, /* @__PURE__ */ React2.createElement("code", null, code)))
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
        codeBlockContent = [line];
      }
      return;
    }
    if (inCodeBlock) {
      codeBlockContent.push(line);
      return;
    }
    if (line.startsWith("> ")) {
      if (!inQuoteBlock) {
        inQuoteBlock = true;
        quoteBlockContent = [];
      }
      quoteBlockContent.push(line.substring(2));
      return;
    } else if (inQuoteBlock) {
      elements.push(
        /* @__PURE__ */ React2.createElement(
          "blockquote",
          {
            key: index,
            className: "border-l-4 border-primary pl-6 py-4 my-6 bg-muted/30 rounded-r-lg italic"
          },
          quoteBlockContent.map((quoteLine, qIndex) => /* @__PURE__ */ React2.createElement(
            "p",
            {
              key: qIndex,
              className: "mb-2 last:mb-0",
              dangerouslySetInnerHTML: {
                __html: processInlineFormatting(quoteLine)
              }
            }
          ))
        )
      );
      quoteBlockContent = [];
      inQuoteBlock = false;
    }
    if (line.startsWith("# ")) {
      elements.push(
        /* @__PURE__ */ React2.createElement(
          "h1",
          {
            key: index,
            className: "prose-h1 scroll-mt-16",
            id: line.substring(2).toLowerCase().replace(/\s+/g, "-")
          },
          line.substring(2)
        )
      );
      return;
    }
    if (line.startsWith("## ")) {
      elements.push(
        /* @__PURE__ */ React2.createElement(
          "h2",
          {
            key: index,
            className: "prose-h2 scroll-mt-16",
            id: line.substring(3).toLowerCase().replace(/\s+/g, "-")
          },
          line.substring(3)
        )
      );
      return;
    }
    if (line.startsWith("### ")) {
      elements.push(
        /* @__PURE__ */ React2.createElement(
          "h3",
          {
            key: index,
            className: "prose-h3 scroll-mt-16",
            id: line.substring(4).toLowerCase().replace(/\s+/g, "-")
          },
          line.substring(4)
        )
      );
      return;
    }
    if (line.startsWith("- ")) {
      elements.push(
        /* @__PURE__ */ React2.createElement(
          "li",
          {
            key: index,
            className: "prose-li",
            dangerouslySetInnerHTML: {
              __html: processInlineFormatting(line.substring(2))
            }
          }
        )
      );
      return;
    }
    if (/^\d+\.\s+/.test(line)) {
      elements.push(
        /* @__PURE__ */ React2.createElement(
          "li",
          {
            key: index,
            className: "prose-li list-decimal",
            dangerouslySetInnerHTML: {
              __html: processInlineFormatting(line.replace(/^\d+\.\s+/, ""))
            }
          }
        )
      );
      return;
    }
    if (line.trim() === "---" || line.trim() === "***") {
      elements.push(/* @__PURE__ */ React2.createElement("hr", { key: index, className: "my-8 border-t border-theme" }));
      return;
    }
    if (line.trim() === "") {
      elements.push(/* @__PURE__ */ React2.createElement("div", { key: index, className: "h-4" }));
      return;
    }
    elements.push(
      /* @__PURE__ */ React2.createElement(
        "p",
        {
          key: index,
          className: "prose-p",
          dangerouslySetInnerHTML: { __html: processInlineFormatting(line) }
        }
      )
    );
  });
  if (inQuoteBlock && quoteBlockContent.length > 0) {
    elements.push(
      /* @__PURE__ */ React2.createElement(
        "blockquote",
        {
          key: "final-quote",
          className: "border-l-4 border-primary pl-6 py-4 my-6 bg-muted/30 rounded-r-lg italic"
        },
        quoteBlockContent.map((quoteLine, qIndex) => /* @__PURE__ */ React2.createElement(
          "p",
          {
            key: qIndex,
            className: "mb-2 last:mb-0",
            dangerouslySetInnerHTML: {
              __html: processInlineFormatting(quoteLine)
            }
          }
        ))
      )
    );
  }
  return /* @__PURE__ */ React2.createElement("div", { className: "prose prose-lg max-w-none" }, elements);
}
var Markdown_default = Markdown;

// src/components/BackButton.tsx
import Link6 from "next/link";
function BackButton({ fallbackUrl = "/posts" }) {
  const handleBackClick = (e) => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  };
  return /* @__PURE__ */ React.createElement(
    Link6,
    {
      href: fallbackUrl,
      onClick: handleBackClick,
      className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-card hover:bg-muted text-muted-foreground hover:text-primary transition-all duration-200 group"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        className: "w-4 h-4 transition-transform group-hover:-translate-x-1",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24"
      },
      /* @__PURE__ */ React.createElement(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 2,
          d: "M15 19l-7-7 7-7"
        }
      )
    ),
    /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, "Back to Articles")
  );
}
var BackButton_default = BackButton;

// src/components/RelatedPosts.tsx
import Link7 from "next/link";
function RelatedPosts({
  currentPost,
  allPosts,
  maxPosts = 3
}) {
  let relatedPosts = allPosts.filter(
    (post) => post.slug !== currentPost.slug && post.category === currentPost.category
  ).slice(0, maxPosts);
  if (relatedPosts.length < maxPosts) {
    const additionalPosts = allPosts.filter(
      (post) => post.slug !== currentPost.slug && !relatedPosts.some((rp) => rp.slug === post.slug)
    ).sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    }).slice(0, maxPosts - relatedPosts.length);
    relatedPosts = [...relatedPosts, ...additionalPosts];
  }
  if (relatedPosts.length === 0) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-12" }, /* @__PURE__ */ React.createElement("h2", { className: "heading-2 mb-4" }, currentPost.category && relatedPosts.some((p) => p.category === currentPost.category) ? `More ${currentPost.category} Articles` : "Related Articles"), /* @__PURE__ */ React.createElement("p", { className: "body-large text-muted-foreground max-w-2xl mx-auto" }, "Continue exploring with these handpicked articles")), /* @__PURE__ */ React.createElement("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3" }, relatedPosts.map((post, index) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: post.slug,
      className: "animate-fadeInUp",
      style: { animationDelay: `${index * 0.1}s` }
    },
    /* @__PURE__ */ React.createElement(PostCard_default, { post })
  ))), /* @__PURE__ */ React.createElement("div", { className: "text-center mt-12" }, /* @__PURE__ */ React.createElement(Link7, { href: "/posts", className: "btn btn-ghost btn-lg group" }, /* @__PURE__ */ React.createElement("span", null, "Explore All Articles"), /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-5 h-5 ml-2 transition-transform group-hover:translate-x-1",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M17 8l4 4m0 0l-4 4m4-4H3"
      }
    )
  ))));
}
var RelatedPosts_default = RelatedPosts;

// src/app/posts/[slug]/page.tsx
var dynamic3 = "force-dynamic";
var revalidate3 = 0;
async function resolveParams(params) {
  return params ? await params : null;
}
async function generateMetadata2({
  params
}) {
  const resolvedParams = await resolveParams(params);
  if (!resolvedParams) return {};
  const { slug } = resolvedParams;
  const post = await loadPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [{ url: post.imageUrl }] : void 0,
      type: "article"
    },
    twitter: {
      card: post.imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.imageUrl ? [post.imageUrl] : void 0
    }
  };
}
async function PostPage({ params }) {
  var _a;
  const resolvedParams = await resolveParams(params);
  if (!resolvedParams) {
    return notFound();
  }
  const { slug } = resolvedParams;
  const siteData = loadSite();
  const [post, postsData] = await Promise.all([
    loadPostBySlug(slug),
    loadPosts()
  ]);
  if (!post) return notFound();
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    } catch (e) {
      return "Recently";
    }
  };
  const readingTime = Math.max(
    1,
    Math.ceil((((_a = post.content) == null ? void 0 : _a.length) || 0) / 1e3)
  );
  return /* @__PURE__ */ React.createElement("main", { className: "min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]" }, /* @__PURE__ */ React.createElement(Header_default, { siteName: siteData.siteName, logoUrl: siteData.logoUrl }), /* @__PURE__ */ React.createElement("section", { className: "relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8" }, /* @__PURE__ */ React.createElement(BackButton_default, null)), /* @__PURE__ */ React.createElement("header", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-4 mb-6 text-sm text-muted-foreground" }, post.category && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium" }, post.category), /* @__PURE__ */ React.createElement("span", null, "\u2022")), /* @__PURE__ */ React.createElement("span", null, formatDate(post.publishedAt)), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", null, readingTime, " min read")), /* @__PURE__ */ React.createElement("h1", { className: "heading-1 mb-6 max-w-4xl mx-auto" }, post.title), /* @__PURE__ */ React.createElement("p", { className: "body-large text-muted-foreground mb-8 max-w-2xl mx-auto" }, post.excerpt), post.author && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-3 mb-8" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold" }, post.author.charAt(0).toUpperCase()), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "font-medium" }, post.author), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground" }, "Author")))))), post.imageUrl && /* @__PURE__ */ React.createElement("section", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8" }, /* @__PURE__ */ React.createElement("div", { className: "relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl" }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: post.imageUrl,
      alt: post.title,
      className: "image-cover"
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" })))), /* @__PURE__ */ React.createElement("article", { className: "py-16" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement("div", { className: "grid lg:grid-cols-4 gap-12" }, /* @__PURE__ */ React.createElement("aside", { className: "lg:col-span-1 hidden lg:block" }, /* @__PURE__ */ React.createElement("div", { className: "sticky top-24" }, /* @__PURE__ */ React.createElement("div", { className: "card p-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold mb-4" }, "Article Info"), /* @__PURE__ */ React.createElement("div", { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-4 h-4 text-muted-foreground",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      }
    )
  ), /* @__PURE__ */ React.createElement("span", null, readingTime, " min read")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-4 h-4 text-muted-foreground",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      }
    )
  ), /* @__PURE__ */ React.createElement("span", null, formatDate(post.publishedAt))), post.category && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-4 h-4 text-muted-foreground",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      }
    )
  ), /* @__PURE__ */ React.createElement("span", null, post.category))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 pt-6 border-t border-theme" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold mb-3" }, "Share Article"), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { className: "w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-4 h-4",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" })
  )), /* @__PURE__ */ React.createElement("button", { className: "w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-4 h-4",
      fill: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" })
  ))))))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-3" }, /* @__PURE__ */ React.createElement("div", { className: "prose-container" }, /* @__PURE__ */ React.createElement(Markdown_default, { content: post.content })), /* @__PURE__ */ React.createElement("div", { className: "mt-12 pt-8 border-t border-theme" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4" }, post.author && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold" }, post.author.charAt(0).toUpperCase()), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-medium" }, post.author), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-muted-foreground" }, "Published on ", formatDate(post.publishedAt)))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-muted-foreground" }, "Share:"), /* @__PURE__ */ React.createElement("button", { className: "btn btn-ghost btn-sm" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "w-4 h-4",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    },
    /* @__PURE__ */ React.createElement(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
        d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
      }
    )
  ))))))))), /* @__PURE__ */ React.createElement("section", { className: "py-16 bg-muted/30" }, /* @__PURE__ */ React.createElement("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" }, /* @__PURE__ */ React.createElement(RelatedPosts_default, { currentPost: post, allPosts: postsData, maxPosts: 3 }))), /* @__PURE__ */ React.createElement(Footer_default, { siteName: siteData.siteName }));
}

// src/index.ts
import { default as default2 } from "react";
function createBlogShell(config) {
  initializeBrandConfig(config);
  return {
    RootLayout,
    generateRootMetadata: generateMetadata,
    home: {
      Page: Home,
      dynamic,
      revalidate
    },
    postsIndex: {
      Page: PostsIndexPage,
      dynamic: dynamic2,
      revalidate: revalidate2
    },
    postDetail: {
      Page: PostPage,
      dynamic: dynamic3,
      revalidate: revalidate3,
      generateMetadata: generateMetadata2
    }
  };
}
export {
  default2 as React,
  createBlogShell,
  defineBrandConfig,
  loadPostBySlug,
  loadPosts,
  loadSeo,
  loadSite,
  loadTheme
};
