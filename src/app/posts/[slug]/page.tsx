import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadPostBySlug, loadPosts, loadSite } from "@caleblawson/blog-shell";
import Header from "@caleblawson/blog-shell/Header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Simple components for the template
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

function BackButton() {
  return (
    <a href="/posts" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-theme bg-card hover:bg-muted transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Posts
    </a>
  );
}

function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none">
      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
    </div>
  );
}

function RelatedPosts({ currentPost, allPosts, maxPosts }: { currentPost: any; allPosts: any[]; maxPosts: number }) {
  const related = allPosts
    .filter(post => post.slug !== currentPost.slug)
    .slice(0, maxPosts);

  return (
    <div>
      <h2 className="heading-2 mb-8 text-center">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map(post => (
          <div key={post.slug} className="card p-6">
            <h3 className="font-semibold mb-2">
              <a href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
                {post.title}
              </a>
            </h3>
            <p className="text-muted-foreground text-sm">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface Params {
  slug: string;
}

interface PostPageProps {
  params?: Promise<Params>;
}

async function resolveParams(params?: PostPageProps["params"]) {
  return params ? await params : null;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
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

export default async function PostPage({ params }: PostPageProps) {
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
  if (!post) return notFound();

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  const readingTime = Math.max(
    1,
    Math.ceil((post.content?.length || 0) / 1000)
  );

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <Header siteName={siteData.siteName} logoUrl={siteData.logoUrl} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <BackButton />
          </div>

          <header className="text-center">
            {/* Category and Meta Info */}
            <div className="flex items-center justify-center gap-4 mb-6 text-sm text-muted-foreground">
              {post.category && (
                <>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    {post.category}
                  </span>
                  <span>•</span>
                </>
              )}
              <span>{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{readingTime} min read</span>
            </div>

            {/* Title */}
            <h1 className="heading-1 mb-6 max-w-4xl mx-auto">{post.title}</h1>

            {/* Excerpt */}
            <p className="body-large text-muted-foreground mb-8 max-w-2xl mx-auto">
              {post.excerpt}
            </p>

            {/* Author Info */}
            {post.author && (
              <div className="flex items-center justify-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-medium">{post.author}</div>
                  <div className="text-sm text-muted-foreground">Author</div>
                </div>
              </div>
            )}
          </header>
        </div>
      </section>

      {/* Featured Image */}
      {post.imageUrl && (
        <section className="relative">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-8">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt={post.title}
                className="image-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <article className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-12">
            {/* Table of Contents - could be added later */}
            <aside className="lg:col-span-1 hidden lg:block">
              <div className="sticky top-24">
                <div className="card p-6">
                  <h3 className="font-semibold mb-4">Article Info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>{readingTime} min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    {post.category && (
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                          />
                        </svg>
                        <span>{post.category}</span>
                      </div>
                    )}
                  </div>

                  {/* Share buttons */}
                  <div className="mt-6 pt-6 border-t border-theme">
                    <h4 className="font-semibold mb-3">Share Article</h4>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </button>
                      <button className="w-10 h-10 rounded-lg bg-muted hover:bg-primary hover:text-white transition-colors flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose-container">
                <Markdown content={post.content} />
              </div>

              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-theme">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  {post.author && (
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {post.author.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{post.author}</div>
                        <div className="text-sm text-muted-foreground">
                          Published on {formatDate(post.publishedAt)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      Share:
                    </span>
                    <button className="btn btn-ghost btn-sm">
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
                          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <RelatedPosts currentPost={post} allPosts={postsData} maxPosts={3} />
        </div>
      </section>

      <Footer siteName={siteData.siteName} />
    </main>
  );
}
