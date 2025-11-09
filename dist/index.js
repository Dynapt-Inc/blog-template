import RootLayout, { generateMetadata as generateRootMetadata, } from "./app/layout";
import HomePage, { dynamic as homeDynamic, revalidate as homeRevalidate, } from "./app/page";
import PostsIndexPage, { dynamic as postsIndexDynamic, revalidate as postsIndexRevalidate, } from "./app/posts/page";
import PostPage, { dynamic as postPageDynamic, revalidate as postPageRevalidate, generateMetadata as generatePostMetadata, } from "./app/posts/[slug]/page";
import { defineBrandConfig, initializeBrandConfig, } from "./lib/brand-config";
import { loadPostBySlug, loadPosts, loadSeo, loadSite, loadTheme, } from "./lib/content";
export function createBlogShell(config) {
    initializeBrandConfig(config);
    return {
        RootLayout,
        generateRootMetadata,
        home: {
            Page: HomePage,
            dynamic: homeDynamic,
            revalidate: homeRevalidate,
        },
        postsIndex: {
            Page: PostsIndexPage,
            dynamic: postsIndexDynamic,
            revalidate: postsIndexRevalidate,
        },
        postDetail: {
            Page: PostPage,
            dynamic: postPageDynamic,
            revalidate: postPageRevalidate,
            generateMetadata: generatePostMetadata,
        },
    };
}
export { defineBrandConfig };
export { loadPosts, loadPostBySlug, loadSite, loadTheme, loadSeo };
