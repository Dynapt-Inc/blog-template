import { type PostData } from "../lib/content";
interface PostCardProps {
    post: PostData;
    featured?: boolean;
    variant?: "default" | "horizontal" | "minimal";
}
export declare function PostCard({ post, featured, variant, }: PostCardProps): import("react/jsx-runtime").JSX.Element;
export default PostCard;
