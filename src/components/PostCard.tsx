import Link from "next/link";
import { type PostData } from "@/lib/content";

interface PostCardProps {
  post: PostData;
  featured?: boolean;
  variant?: "default" | "horizontal" | "minimal";
}

export function PostCard({
  post,
  featured = false,
  variant = "default",
}: PostCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
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

  if (variant === "horizontal") {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="card group flex flex-col sm:flex-row gap-6 overflow-hidden"
      >
        <div className="relative w-full sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden">
          {post.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.imageUrl} alt="" className="image-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted-dark flex items-center justify-center">
              <svg
                className="w-12 h-12 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}
        </div>

        <div className="card-content flex-1">
          <div className="flex items-center gap-3 mb-3">
            {post.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {post.category}
              </span>
            )}
            <span className="text-sm text-muted-foreground">
              {formatDate(post.publishedAt)}
            </span>
            <span className="text-sm text-muted-foreground">
              {readingTime} min read
            </span>
          </div>

          <h3 className="heading-4 mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="body-medium text-muted-foreground mb-4 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            {post.author && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-muted-foreground">
                  {post.author}
                </span>
              </div>
            )}

            <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
              <span>Read more</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "minimal") {
    return (
      <Link
        href={`/posts/${post.slug}`}
        className="group block py-4 border-b border-theme hover:bg-muted/50 transition-colors px-4 -mx-4"
      >
        <div className="flex items-center gap-3 mb-2">
          {post.category && (
            <span className="text-xs font-medium text-primary">
              {post.category}
            </span>
          )}
          <span className="text-xs text-muted-foreground">
            {formatDate(post.publishedAt)}
          </span>
        </div>

        <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2 mb-1">
          {post.title}
        </h3>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm">
          {post.author && (
            <span className="text-muted-foreground">{post.author}</span>
          )}
          <span className="text-muted-foreground">{readingTime} min read</span>
        </div>
      </Link>
    );
  }

  // Default card variant
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`card group block overflow-hidden ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div
        className={`relative w-full bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden ${
          featured ? "h-64 md:h-80" : "h-48"
        }`}
      >
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl} alt="" className="image-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-muted to-muted-dark flex items-center justify-center">
            <svg
              className={`text-muted-foreground ${
                featured ? "w-16 h-16" : "w-12 h-12"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
        )}

        {/* Overlay with category badge */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <div className="absolute bottom-4 left-4 right-4">
            {post.category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 backdrop-blur-sm text-white">
                {post.category}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
          <span>{formatDate(post.publishedAt)}</span>
          <span>•</span>
          <span>{readingTime} min read</span>
        </div>

        <h3
          className={`font-bold group-hover:text-primary transition-colors line-clamp-2 mb-3 ${
            featured ? "text-xl md:text-2xl" : "text-lg"
          }`}
        >
          {post.title}
        </h3>

        <p
          className={`text-muted-foreground line-clamp-3 mb-4 ${
            featured ? "text-base" : "text-sm"
          }`}
        >
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between">
          {post.author && (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                {post.author.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">
                {post.author}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
            <span>Read more</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
          </div>
        </div>
      </div>
    </Link>
  );
}

export default PostCard;
