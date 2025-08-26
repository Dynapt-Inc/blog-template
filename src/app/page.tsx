import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { loadPosts, loadSite } from "@/lib/content";

export default function Home() {
  const siteData = loadSite();
  const postsData = loadPosts();
  const latestPosts = [...postsData].sort((a, b) => {
    const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
    const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
    return tb - ta;
  });
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header siteName={siteData.siteName} logoUrl={siteData.logoUrl} />
      <Hero
        title={siteData.heroTitle}
        subtitle={siteData.heroSubtitle}
        imageUrl={siteData.heroImageUrl}
      />

      <section id="articles" className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-semibold">Latest articles</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {latestPosts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* About and Contact sections removed */}

      <Footer siteName={siteData.siteName} />
    </main>
  );
}
