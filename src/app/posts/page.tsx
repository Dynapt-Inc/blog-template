import { PostsIndexClient } from "@/components/PostsIndexClient";
import { loadPosts, loadSite } from "@/lib/content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PostsIndexPage() {
  const site = loadSite();
  const posts = await loadPosts();
  return <PostsIndexClient site={site} posts={posts} />;
}
