import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { loadPosts, loadSite } from "@/lib/content";

export default function PostsIndexPage() {
  const site = loadSite();
  const posts = loadPosts();
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Header siteName={site.siteName} logoUrl={site.logoUrl} />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight">All articles</h1>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
      <Footer siteName={site.siteName} />
    </main>
  );
}
