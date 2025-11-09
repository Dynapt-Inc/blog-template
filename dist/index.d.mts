import * as react from 'react';
import { Metadata } from 'next';

declare function generateMetadata$1(): Metadata;
declare function RootLayout({ children, }: Readonly<{
    children: React.ReactNode;
}>): react.JSX.Element;

declare const dynamic$2 = "force-dynamic";
declare const revalidate$2 = 0;
declare function Home(): Promise<react.JSX.Element>;

declare const dynamic$1 = "force-dynamic";
declare const revalidate$1 = 0;
declare function PostsIndexPage(): Promise<react.JSX.Element>;

declare const dynamic = "force-dynamic";
declare const revalidate = 0;
interface Params {
    slug: string;
}
interface PostPageProps {
    params?: Promise<Params>;
}
declare function generateMetadata({ params, }: PostPageProps): Promise<Metadata>;
declare function PostPage({ params }: PostPageProps): Promise<react.JSX.Element>;

interface ThemeData {
    colors?: {
        primary?: string;
        secondary?: string;
        tertiary?: string;
        background?: string;
        foreground?: string;
    };
}
interface SeoData {
    title?: string;
    description?: string;
    keywords?: string | string[];
}
interface SiteData {
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

type BrandSiteConfig = Partial<Omit<SiteData, "theme" | "seo">> & {
    theme?: ThemeData;
    seo?: SeoData;
};
interface BrandConfig {
    site?: BrandSiteConfig;
    theme?: ThemeData;
    seo?: SeoData;
}
declare function defineBrandConfig(config: BrandConfig): BrandConfig;

interface PostData {
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
declare function loadSite(): SiteData;
declare function loadTheme(): ThemeData | undefined;
declare function loadSeo(): SeoData | undefined;
declare function loadPosts(): Promise<PostData[]>;
declare function loadPostBySlug(slug: string): Promise<PostData | null>;

interface BlogShellEntryPoints {
    RootLayout: typeof RootLayout;
    generateRootMetadata: typeof generateMetadata$1;
    home: {
        Page: typeof Home;
        dynamic: typeof dynamic$2;
        revalidate: typeof revalidate$2;
    };
    postsIndex: {
        Page: typeof PostsIndexPage;
        dynamic: typeof dynamic$1;
        revalidate: typeof revalidate$1;
    };
    postDetail: {
        Page: typeof PostPage;
        dynamic: typeof dynamic;
        revalidate: typeof revalidate;
        generateMetadata: typeof generateMetadata;
    };
}
declare function createBlogShell(config: BrandConfig): BlogShellEntryPoints;

export { type BlogShellEntryPoints, type BrandConfig, type PostData, type SeoData, type SiteData, type ThemeData, createBlogShell, defineBrandConfig, loadPostBySlug, loadPosts, loadSeo, loadSite, loadTheme };
