import Link from "next/link";
import Header from "@caleblawson/blog-shell/Header";
import PostCard from "@caleblawson/blog-shell/PostCard";
import { loadPosts, loadSite } from "@caleblawson/blog-shell/server";

// Simple Hero component for the template
function Hero({
  title,
  subtitle,
  imageUrl,
}: {
  title: string;
  subtitle: string;
  imageUrl?: string;
}) {
  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="heading-1 mb-6">{title}</h1>
        <p className="body-large text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

// Simple Footer component for the template
function Footer({ siteName }: { siteName: string }) {
  return (
    <footer className="border-t border-theme bg-muted/20 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-muted-foreground">
          © {new Date().getFullYear()} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
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
      postsData
        .map((post) => post.category)
        .filter((category): category is string => Boolean(category))
    ),
  ];

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Header siteName={siteData.siteName} logoUrl={siteData.logoUrl} />
      <Hero
        title={siteData.heroTitle}
        subtitle={siteData.heroSubtitle}
        imageUrl={siteData.heroImageUrl}
      />

      {/* Featured Article Section */}
      {featuredPost && (
        <section id="featured" className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Featured Article</h2>
              <p className="body-large text-muted-foreground max-w-2xl mx-auto">
                Dive into our latest and most engaging content
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <PostCard post={featuredPost} variant="horizontal" />
            </div>
          </div>
        </section>
      )}

      {/* Latest Articles Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="heading-2 mb-4">Latest Articles</h2>
              <p className="body-large text-muted-foreground">
                Stay updated with our newest insights and stories
              </p>
            </div>

            {postsData.length > 6 && (
              <Link
                href="/posts"
                className="btn btn-ghost btn-md group hidden sm:inline-flex"
              >
                <span>View All</span>
                <svg
                  className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            )}
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post, index) => (
              <div
                key={post.slug}
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PostCard post={post} />
              </div>
            ))}
          </div>

          {postsData.length > 6 && (
            <div className="text-center mt-12">
              <Link
                href="/posts"
                className="btn btn-primary btn-lg group sm:hidden"
              >
                <span>View All Articles</span>
                <svg
                  className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="heading-2 mb-4">Explore by Category</h2>
              <p className="body-large text-muted-foreground max-w-2xl mx-auto">
                Discover content tailored to your interests
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => {
                const categoryPosts = postsData.filter(
                  (post) => post.category === category
                );
                return (
                  <a
                    key={category}
                    href={`/posts?category=${encodeURIComponent(category)}`}
                    className="group inline-flex items-center gap-2 px-6 py-3 rounded-full border border-theme bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200"
                  >
                    <span className="font-medium">{category}</span>
                    <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {categoryPosts.length}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter/CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="heading-2 text-white mb-4">Stay Updated</h2>
          <p className="body-large text-white/90 mb-8 max-w-2xl mx-auto">
            Get the latest articles and insights delivered straight to your
            inbox. Join our community of readers who stay ahead of the curve.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/20 backdrop-blur-sm text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
            <button className="btn bg-white text-primary hover:bg-white/90 btn-md font-semibold">
              Subscribe
            </button>
          </div>

          <p className="text-white/70 text-sm mt-4">
            No spam, unsubscribe at any time
          </p>
        </div>
      </section>

      <Footer siteName={siteData.siteName} />
    </main>
  );
}
