import type { RowDataPacket } from "mysql2/promise";
import { withConnection } from "./db";

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

interface PostRow extends RowDataPacket {
  id: string;
  organization_id: string | null;
  slug: string;
  status: string;
  title: string;
  content: string;
  excerpt: string | null;
  url: string | null;
  metadata: string | null;
  created_at: Date;
  updated_at: Date;
  published_at: Date | null;
}

const SELECT_COLUMNS = [
  "id",
  "organization_id",
  "slug",
  "status",
  "title",
  "content",
  "excerpt",
  "url",
  "metadata",
  "created_at",
  "updated_at",
  "published_at",
].join(", ");

function parseMetadata(value: string | null): Record<string, unknown> | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function toRecord(row: PostRow): BlogPostRecord {
  return {
    id: row.id,
    organizationId: row.organization_id,
    slug: row.slug,
    status: row.status as BlogPostRecord["status"],
    title: row.title,
    content: row.content,
    excerpt: row.excerpt,
    url: row.url,
    metadata: parseMetadata(row.metadata),
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
    publishedAt: row.published_at ? row.published_at.toISOString() : null,
  };
}

export async function fetchPublishedPosts(
  organizationId: string,
  limit = 100
): Promise<BlogPostRecord[]> {
  return withConnection(async (connection) => {
    // Ensure limit is an integer to avoid MySQL parameter binding issues
    const limitInt = Math.max(1, Math.floor(Number(limit) || 100));
    const [rows] = await connection.execute<PostRow[]>(
      `
        SELECT ${SELECT_COLUMNS}
        FROM posts
        WHERE organization_id = ?
          AND status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        LIMIT ?
      `,
      [organizationId, limitInt]
    );
    return rows.map(toRecord);
  });
}

export async function fetchPostBySlug(
  organizationId: string,
  slug: string
): Promise<BlogPostRecord | null> {
  return withConnection(async (connection) => {
    const [rows] = await connection.execute<PostRow[]>(
      `
        SELECT ${SELECT_COLUMNS}
        FROM posts
        WHERE organization_id = ?
          AND slug = ?
          AND status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        LIMIT 1
      `,
      [organizationId, slug]
    );
    if (!rows.length) return null;
    return toRecord(rows[0]);
  });
}

