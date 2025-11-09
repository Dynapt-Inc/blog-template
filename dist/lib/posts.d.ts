export interface BlogPostRecord {
    id: string;
    organizationId: string | null;
    slug: string;
    status: "draft" | "scheduled" | "deploying" | "published";
    title: string;
    content: string;
    excerpt: string | null;
    url: string | null;
    metadata: Record<string, unknown> | null;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}
export declare function fetchPublishedPosts(organizationId: string, limit?: number): Promise<BlogPostRecord[]>;
export declare function fetchPostBySlug(organizationId: string, slug: string): Promise<BlogPostRecord | null>;
