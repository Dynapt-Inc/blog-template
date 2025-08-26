import Link from "next/link";
import { type PostData } from "@/lib/content";

interface PostCardProps {
  post: PostData;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={`/posts/${post.slug}`}
      className="rounded-lg border bg-white p-5 block hover:shadow-sm transition-shadow"
    >
      <div className="relative h-40 w-full rounded bg-gray-100 overflow-hidden">
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.imageUrl} alt="" className="image-cover" />
        ) : null}
      </div>
      <h3 className="mt-4 text-lg font-semibold line-clamp-2">{post.title}</h3>
      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
      <span className="mt-4 inline-flex text-sm text-gray-900 hover:underline">
        Read more
      </span>
    </Link>
  );
}

export default PostCard;
