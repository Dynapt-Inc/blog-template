"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PostCard from "../components/PostCard";
export function PostsIndexClient({ site, posts }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("grid");
    const categories = useMemo(() => {
        const cats = [
            ...new Set(posts.map((post) => post.category).filter(Boolean)),
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
            filtered = filtered.filter((post) => {
                var _a, _b;
                return post.title.toLowerCase().includes(term) ||
                    post.excerpt.toLowerCase().includes(term) ||
                    ((_a = post.author) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(term)) ||
                    ((_b = post.category) === null || _b === void 0 ? void 0 : _b.toLowerCase().includes(term));
            });
        }
        return filtered.sort((a, b) => {
            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
            return dateB - dateA;
        });
    }, [posts, searchTerm, selectedCategory]);
    return (_jsxs("main", { className: "min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]", children: [_jsx(Header, { siteName: site.siteName, logoUrl: site.logoUrl }), _jsx("section", { className: "bg-gradient-to-br from-background via-muted/50 to-background py-16", children: _jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "heading-1 mb-6", children: "All Articles" }), _jsx("p", { className: "body-large text-muted-foreground max-w-2xl mx-auto mb-8", children: "Explore our complete collection of insights, tutorials, and stories. Find exactly what you're looking for with our search and filtering tools." }), _jsxs("div", { className: "flex items-center justify-center gap-2 text-sm text-muted-foreground", children: [_jsxs("span", { children: [posts.length, " articles"] }), _jsx("span", { children: "\u2022" }), _jsxs("span", { children: [categories.length - 1, " categories"] })] })] }) }) }), _jsx("section", { className: "border-b border-theme bg-card", children: _jsxs("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6", children: [_jsxs("div", { className: "flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between", children: [_jsxs("div", { className: "relative flex-1 max-w-md", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx("svg", { className: "h-5 w-5 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("input", { type: "text", placeholder: "Search articles...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "block w-full pl-10 pr-3 py-2 border border-theme rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("label", { className: "text-sm font-medium text-muted-foreground", children: "Category:" }), _jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "px-3 py-2 border border-theme rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent", children: categories.map((category) => (_jsx("option", { value: category, children: category === "all" ? "All Categories" : category }, category))) })] }), _jsxs("div", { className: "flex items-center gap-1 p-1 bg-muted rounded-lg", children: [_jsx("button", { onClick: () => setViewMode("grid"), className: `p-2 rounded-md transition-colors ${viewMode === "grid"
                                                        ? "bg-primary text-white"
                                                        : "text-muted-foreground hover:text-foreground"}`, "aria-label": "Grid view", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" }) }) }), _jsx("button", { onClick: () => setViewMode("list"), className: `p-2 rounded-md transition-colors ${viewMode === "list"
                                                        ? "bg-primary text-white"
                                                        : "text-muted-foreground hover:text-foreground"}`, "aria-label": "List view", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 10h16M4 14h16M4 18h16" }) }) })] })] })] }), (searchTerm || selectedCategory !== "all") && (_jsxs("div", { className: "flex items-center gap-2 mt-4 pt-4 border-t border-theme", children: [_jsx("span", { className: "text-sm text-muted-foreground", children: "Active filters:" }), searchTerm && (_jsxs("div", { className: "inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm", children: [_jsxs("span", { children: ["Search: \"", searchTerm, "\""] }), _jsx("button", { onClick: () => setSearchTerm(""), className: "ml-1 hover:bg-primary/20 rounded-full p-0.5", children: _jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })), selectedCategory !== "all" && (_jsxs("div", { className: "inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm", children: [_jsxs("span", { children: ["Category: ", selectedCategory] }), _jsx("button", { onClick: () => setSelectedCategory("all"), className: "ml-1 hover:bg-secondary/20 rounded-full p-0.5", children: _jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] })), _jsx("button", { onClick: () => {
                                        setSearchTerm("");
                                        setSelectedCategory("all");
                                    }, className: "text-sm text-muted-foreground hover:text-foreground underline", children: "Clear all" })] }))] }) }), _jsx("section", { className: "py-12", children: _jsx("div", { className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", children: filteredPosts.length === 0 ? (_jsxs("div", { className: "text-center py-16", children: [_jsx("div", { className: "w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center", children: _jsx("svg", { className: "w-8 h-8 text-muted-foreground", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" }) }) }), _jsx("h3", { className: "heading-3 mb-2", children: "No articles found" }), _jsx("p", { className: "text-muted-foreground mb-4", children: "Try adjusting your search or filter criteria" }), _jsx("button", { onClick: () => {
                                    setSearchTerm("");
                                    setSelectedCategory("all");
                                }, className: "btn btn-primary btn-md", children: "Clear filters" })] })) : viewMode === "grid" ? (_jsx("div", { className: "grid gap-8 md:grid-cols-2 lg:grid-cols-3", children: filteredPosts.map((post, index) => (_jsx("div", { className: "animate-fadeInUp", style: { animationDelay: `${index * 0.05}s` }, children: _jsx(PostCard, { post: post }) }, post.slug))) })) : (_jsx("div", { className: "space-y-0", children: filteredPosts.map((post, index) => (_jsx("div", { className: "animate-fadeInUp", style: { animationDelay: `${index * 0.03}s` }, children: _jsx(PostCard, { post: post, variant: "minimal" }) }, post.slug))) })) }) }), _jsx(Footer, { siteName: site.siteName })] }));
}
