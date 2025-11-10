import { PostsIndexClient } from "@caleblawson/blog-shell/PostsIndexClient";
import { loadPosts, loadSite } from "@caleblawson/blog-shell";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PostsIndexPage() {
  const site = loadSite();
  const posts = await loadPosts();
  return <PostsIndexClient site={site} posts={posts} />;
}
