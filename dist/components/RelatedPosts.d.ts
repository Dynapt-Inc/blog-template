import { type PostData } from "../lib/content";
interface RelatedPostsProps {
    currentPost: PostData;
    allPosts: PostData[];
    maxPosts?: number;
}
export declare function RelatedPosts({ currentPost, allPosts, maxPosts, }: RelatedPostsProps): import("react/jsx-runtime").JSX.Element | null;
export default RelatedPosts;
