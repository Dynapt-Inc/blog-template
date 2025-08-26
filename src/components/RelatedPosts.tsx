import Link from "next/link";
import { type PostData } from "@/lib/content";

interface RelatedPostsProps {
  currentPost: PostData;
  allPosts: PostData[];
  maxPosts?: number;
}

export function RelatedPosts({
  currentPost,
  allPosts,
  maxPosts = 3,
}: RelatedPostsProps) {
  // Filter posts by the same category, excluding the current post
  const relatedPosts = allPosts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && post.category === currentPost.category
    )
    .slice(0, maxPosts);

  // If no related posts found, don't render anything
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold tracking-tight mb-6">
        Related {currentPost.category} Posts
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {relatedPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="rounded-lg border bg-white p-5 block hover:shadow-sm transition-shadow"
          >
            <div className="relative h-32 w-full rounded bg-gray-100 overflow-hidden mb-4">
              {post.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.imageUrl} alt="" className="image-cover" />
              ) : null}
            </div>
            <h3 className="text-lg font-semibold line-clamp-2 mb-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{post.excerpt}</p>
            <span className="mt-3 inline-flex text-sm text-gray-900 hover:underline">
              Read more →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default RelatedPosts;
