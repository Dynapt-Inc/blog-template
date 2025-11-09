import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Link from "next/link";
import PostCard from "../components/PostCard";
export function RelatedPosts({ currentPost, allPosts, maxPosts = 3, }) {
    // First try to find posts in the same category
    let relatedPosts = allPosts
        .filter((post) => post.slug !== currentPost.slug && post.category === currentPost.category)
        .slice(0, maxPosts);
    // If we don't have enough posts in the same category, fill with other recent posts
    if (relatedPosts.length < maxPosts) {
        const additionalPosts = allPosts
            .filter((post) => post.slug !== currentPost.slug &&
            !relatedPosts.some((rp) => rp.slug === post.slug))
            .sort((a, b) => {
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return dateB - dateA;
        })
            .slice(0, maxPosts - relatedPosts.length);
        relatedPosts = [...relatedPosts, ...additionalPosts];
    }
    // If no related posts found, don't render anything
    if (relatedPosts.length === 0) {
        return null;
    }
    return (_jsxs("section", { children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "heading-2 mb-4", children: currentPost.category &&
                            relatedPosts.some((p) => p.category === currentPost.category)
                            ? `More ${currentPost.category} Articles`
                            : "Related Articles" }), _jsx("p", { className: "body-large text-muted-foreground max-w-2xl mx-auto", children: "Continue exploring with these handpicked articles" })] }), _jsx("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: relatedPosts.map((post, index) => (_jsx("div", { className: "animate-fadeInUp", style: { animationDelay: `${index * 0.1}s` }, children: _jsx(PostCard, { post: post }) }, post.slug))) }), _jsx("div", { className: "text-center mt-12", children: _jsxs(Link, { href: "/posts", className: "btn btn-ghost btn-lg group", children: [_jsx("span", { children: "Explore All Articles" }), _jsx("svg", { className: "w-5 h-5 ml-2 transition-transform group-hover:translate-x-1", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17 8l4 4m0 0l-4 4m4-4H3" }) })] }) })] }));
}
export default RelatedPosts;
