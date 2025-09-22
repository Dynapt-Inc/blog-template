import PostCard from "@/components/PostCard";
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
  // First try to find posts in the same category
  let relatedPosts = allPosts
    .filter(
      (post) =>
        post.slug !== currentPost.slug && post.category === currentPost.category
    )
    .slice(0, maxPosts);

  // If we don't have enough posts in the same category, fill with other recent posts
  if (relatedPosts.length < maxPosts) {
    const additionalPosts = allPosts
      .filter(
        (post) =>
          post.slug !== currentPost.slug &&
          !relatedPosts.some((rp) => rp.slug === post.slug)
      )
      .sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
        return dateB - dateA;
      })
      .slice(0, maxPosts - relatedPosts.length);

    relatedPosts = [...relatedPosts, ...additionalPosts];
  }

  // If no related posts found, don't render anything
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="heading-2 mb-4">
          {currentPost.category &&
          relatedPosts.some((p) => p.category === currentPost.category)
            ? `More ${currentPost.category} Articles`
            : "Related Articles"}
        </h2>
        <p className="body-large text-muted-foreground max-w-2xl mx-auto">
          Continue exploring with these handpicked articles
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {relatedPosts.map((post, index) => (
          <div
            key={post.slug}
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>

      {/* CTA to view all posts */}
      <div className="text-center mt-12">
        <a href="/posts" className="btn btn-ghost btn-lg group">
          <span>Explore All Articles</span>
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
        </a>
      </div>
    </section>
  );
}

export default RelatedPosts;
