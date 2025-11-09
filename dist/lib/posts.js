import { withConnection } from "./db";
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
function parseMetadata(value) {
    if (!value)
        return null;
    try {
        return JSON.parse(value);
    }
    catch {
        return null;
    }
}
function toRecord(row) {
    return {
        id: row.id,
        organizationId: row.organization_id,
        slug: row.slug,
        status: row.status,
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
export async function fetchPublishedPosts(organizationId, limit = 100) {
    return withConnection(async (connection) => {
        const [rows] = await connection.execute(`
        SELECT ${SELECT_COLUMNS}
        FROM posts
        WHERE organization_id = ?
          AND status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        LIMIT ?
      `, [organizationId, limit]);
        return rows.map(toRecord);
    });
}
export async function fetchPostBySlug(organizationId, slug) {
    return withConnection(async (connection) => {
        const [rows] = await connection.execute(`
        SELECT ${SELECT_COLUMNS}
        FROM posts
        WHERE organization_id = ?
          AND slug = ?
          AND status = 'published'
        ORDER BY published_at DESC, updated_at DESC
        LIMIT 1
      `, [organizationId, slug]);
        if (!rows.length)
            return null;
        return toRecord(rows[0]);
    });
}
