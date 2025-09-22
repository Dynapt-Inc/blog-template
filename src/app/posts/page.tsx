"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { loadPosts, loadSite } from "@/lib/content";

export default function PostsIndexPage() {
  const site = loadSite();
  const allPosts = loadPosts();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [
      ...new Set(allPosts.map((post) => post.category).filter(Boolean)),
    ];
    return ["all", ...cats];
  }, [allPosts]);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    let filtered = allPosts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.author?.toLowerCase().includes(term) ||
          post.category?.toLowerCase().includes(term)
      );
    }

    // Sort by publish date (newest first)
    return filtered.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [allPosts, searchTerm, selectedCategory]);

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Header siteName={site.siteName} logoUrl={site.logoUrl} />

      {/* Page Header */}
      <section className="bg-gradient-to-br from-background via-muted/50 to-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="heading-1 mb-6">All Articles</h1>
            <p className="body-large text-muted-foreground max-w-2xl mx-auto mb-8">
              Explore our complete collection of insights, tutorials, and
              stories. Find exactly what you're looking for with our search and
              filtering tools.
            </p>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <span>{allPosts.length} articles</span>
              <span>•</span>
              <span>{categories.length - 1} categories</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="border-b border-theme bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-theme rounded-lg bg-background placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Category:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-theme rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Grid view"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="List view"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedCategory !== "all") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-theme">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>

              {searchTerm && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              {selectedCategory !== "all" && (
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                  <span>Category: {selectedCategory}</span>
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-1 hover:bg-secondary/20 rounded-full p-0.5"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Articles */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.563M15 6.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="heading-3 mb-2">No articles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="btn btn-primary btn-md"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-semibold">
                  {filteredPosts.length === allPosts.length
                    ? `All Articles (${filteredPosts.length})`
                    : `Found ${filteredPosts.length} article${
                        filteredPosts.length !== 1 ? "s" : ""
                      }`}
                </h2>
              </div>

              {viewMode === "grid" ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.slug}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <PostCard post={post} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-0">
                  {filteredPosts.map((post, index) => (
                    <div
                      key={post.slug}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <PostCard post={post} variant="minimal" />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer siteName={site.siteName} />
    </main>
  );
}
