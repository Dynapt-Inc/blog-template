import RootLayout, { generateMetadata as generateRootMetadata } from "./app/layout";
import HomePage, { dynamic as homeDynamic, revalidate as homeRevalidate } from "./app/page";
import PostsIndexPage, { dynamic as postsIndexDynamic, revalidate as postsIndexRevalidate } from "./app/posts/page";
import PostPage, { dynamic as postPageDynamic, revalidate as postPageRevalidate, generateMetadata as generatePostMetadata } from "./app/posts/[slug]/page";
import { defineBrandConfig, type BrandConfig } from "./lib/brand-config";
import { loadPostBySlug, loadPosts, loadSeo, loadSite, loadTheme, type PostData } from "./lib/content";
import type { SeoData, SiteData, ThemeData } from "./lib/site";
export interface BlogShellEntryPoints {
    RootLayout: typeof RootLayout;
    generateRootMetadata: typeof generateRootMetadata;
    home: {
        Page: typeof HomePage;
        dynamic: typeof homeDynamic;
        revalidate: typeof homeRevalidate;
    };
    postsIndex: {
        Page: typeof PostsIndexPage;
        dynamic: typeof postsIndexDynamic;
        revalidate: typeof postsIndexRevalidate;
    };
    postDetail: {
        Page: typeof PostPage;
        dynamic: typeof postPageDynamic;
        revalidate: typeof postPageRevalidate;
        generateMetadata: typeof generatePostMetadata;
    };
}
export declare function createBlogShell(config: BrandConfig): BlogShellEntryPoints;
export { defineBrandConfig };
export type { BrandConfig, PostData, SiteData, ThemeData, SeoData };
export { loadPosts, loadPostBySlug, loadSite, loadTheme, loadSeo };
