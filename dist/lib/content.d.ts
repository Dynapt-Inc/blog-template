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
export declare function loadSite(): SiteData;
export declare function loadTheme(): ThemeData | undefined;
export declare function loadSeo(): SeoData | undefined;
export declare function loadPosts(): Promise<PostData[]>;
export declare function loadPostBySlug(slug: string): Promise<PostData | null>;
export type { SiteData, ThemeData, SeoData } from "./site";
