import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loadPosts, loadSite } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Markdown from "@/components/Markdown";
import BackButton from "@/components/BackButton";
import RelatedPosts from "@/components/RelatedPosts";

interface Params {
  slug: string;
}

export function generateStaticParams() {
  const all = loadPosts();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = loadPosts().find((p) => p.slug === slug);
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

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const siteData = loadSite();
  const postsData = loadPosts();
  const post = postsData.find((p) => p.slug === slug);
  if (!post) return notFound();

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header siteName={siteData.siteName} logoUrl={siteData.logoUrl} />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-6">
          <BackButton />
        </div>
        <header>
          <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {post.author} •{" "}
            {post.publishedAt
              ? new Date(post.publishedAt).toLocaleDateString()
              : "Unknown date"}
          </p>
          <div className="mt-6 relative aspect-[16/9] w-full rounded bg-gray-100 overflow-hidden">
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.imageUrl} alt="" className="image-cover" />
            ) : null}
          </div>
        </header>

        <div className="mt-8">
          <Markdown content={post.content} />
        </div>
        <RelatedPosts currentPost={post} allPosts={postsData} maxPosts={3} />
      </article>
      <Footer siteName={siteData.siteName} />
    </main>
  );
}
