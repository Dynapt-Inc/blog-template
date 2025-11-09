import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { notFound } from "next/navigation";
import { loadPostBySlug, loadPosts, loadSite } from "../../../lib/content";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import Markdown from "../../../components/Markdown";
import BackButton from "../../../components/BackButton";
import RelatedPosts from "../../../components/RelatedPosts";
export const dynamic = "force-dynamic";
export const revalidate = 0;
async function resolveParams(params) {
    return params ? await params : null;
}
export async function generateMetadata({ params, }) {
    const resolvedParams = await resolveParams(params);
    if (!resolvedParams)
        return {};
    const { slug } = resolvedParams;
    const post = await loadPostBySlug(slug);
    if (!post)
        return {};
    return {
        title: post.title,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            images: post.imageUrl ? [{ url: post.imageUrl }] : undefined,
            type: "article",
        },
        twitter: {
            card: post.imageUrl ? "summary_large_image" : "summary",
            title: post.title,
            description: post.excerpt,
            images: post.imageUrl ? [post.imageUrl] : undefined,
        },
    };
}
export default async function PostPage({ params }) {
    var _a;
    const resolvedParams = await resolveParams(params);
    if (!resolvedParams) {
        return notFound();
    }
    const { slug } = resolvedParams;
    const siteData = loadSite();
    const [post, postsData] = await Promise.all([
        loadPostBySlug(slug),
        loadPosts(),
    ]);
    if (!post)
        return notFound();
    const formatDate = (dateString) => {
        if (!dateString)
            return "Recently";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
            });
        }
        catch {
            return "Recently";
        }
    };
    const readingTime = Math.max(1, Math.ceil((((_a = post.content) === null || _a === void 0 ? void 0 : _a.length) || 0) / 1000));
    return (_jsxs("main", { className: "min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]", children: [_jsx(Header, { siteName: siteData.siteName, logoUrl: siteData.logoUrl }), _jsx("section", { className: "relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background", children: _jsxs("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12", children: [_jsx("div", { className: "mb-8", children: _jsx(BackButton, {}) }), _jsxs("header", { className: "text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-4 mb-6 text-sm text-muted-foreground", children: [post.category && (_jsxs(_Fragment, { children: [_jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium", children: post.category }), _jsx("span", { children: "\u2022" })] })), _jsx("span", { children: formatDate(post.publishedAt) }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [readingTime, " min read"] })] }), _jsx("h1", { className: "heading-1 mb-6 max-w-4xl mx-auto", children: post.title }), _jsx("p", { className: "body-large text-muted-foreground mb-8 max-w-2xl mx-auto", children: post.excerpt }), post.author && (_jsxs("div", { className: "flex items-center justify-center gap-3 mb-8", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold", children: post.author.charAt(0).toUpperCase() }), _jsxs("div", { className: "text-left", children: [_jsx("div", { className: "font-medium", children: post.author }), _jsx("div", { className: "text-sm text-muted-foreground", children: "Author" })] })] }))] })] }) }), post.imageUrl && (_jsx("section", { className: "relative", children: _jsx("div", { className: "mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8", children: _jsxs("div", { className: "relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl", children: [_jsx("img", { src: post.imageUrl, alt: post.title, className: "image-cover" }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" })] }) }) })), _jsx("article", { className: "py-16", children: _jsx("div", { className: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "grid lg:grid-cols-4 gap-12", children: [_jsx("aside", { className: "lg:col-span-1 hidden lg:block", children: _jsx("div", { className: "sticky top-24", children: _jsxs("div", { className: "card p-6", children: [_jsx("h3", { className: "font-semibold mb-4", children: "Article Info" }), _jsxs("div", { className: "space-y-3 text-sm", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" }) }), _jsxs("span", { children: [readingTime, " min read"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsx("span", { children: formatDate(post.publishedAt) })] }), post.category && (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("svg", { className: "w-4 h-4 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" }) }), _jsx("span", { children: post.category })] }))] }), _jsxs("div", { className: "mt-6 pt-6 border-t border-theme", children: [_jsx("h4", { className: "font-semibold mb-3", children: "Share Article" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { className: "w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" }) }) }), _jsx("button", { className: "w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center", children: _jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" }) }) })] })] })] }) }) }), _jsxs("div", { className: "lg:col-span-3", children: [_jsx("div", { className: "prose-container", children: _jsx(Markdown, { content: post.content }) }), _jsx("div", { className: "mt-12 pt-8 border-t border-theme", children: _jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [post.author && (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold", children: post.author.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("div", { className: "font-medium", children: post.author }), _jsxs("div", { className: "text-sm text-muted-foreground", children: ["Published on ", formatDate(post.publishedAt)] })] })] })), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Share:" }), _jsx("button", { className: "btn btn-ghost btn-sm", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" }) }) })] })] }) })] })] }) }) }), _jsx("section", { className: "py-16 bg-muted/30", children: _jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: _jsx(RelatedPosts, { currentPost: post, allPosts: postsData, maxPosts: 3 }) }) }), _jsx(Footer, { siteName: siteData.siteName })] }));
}
