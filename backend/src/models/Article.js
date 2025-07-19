import { query, getRow, getRows } from '../utils/database.js';

class Article {
  static async create({ title, content, createdBy }) {
    const sql = `
      INSERT INTO articles (title, content, created_by)
      VALUES ($1, $2, $3)
      RETURNING id, title, content, created_by, created_at, updated_at
    `;
    
    const result = await query(sql, [title, content, createdBy]);
    return result.rows[0];
  }

  static async findById(id) {
    const sql = `
      SELECT a.id, a.title, a.content, a.created_at, a.updated_at,
             u.name as author_name, u.id as author_id
      FROM articles a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = $1
    `;
    
    return await getRow(sql, [id]);
  }

  static async getAll(limit = 50, offset = 0) {
    const sql = `
      SELECT a.id, a.title, a.content, a.created_at, a.updated_at,
             u.name as author_name, u.id as author_id,
             LEFT(a.content, 200) as excerpt
      FROM articles a
      LEFT JOIN users u ON a.created_by = u.id
      ORDER BY a.created_at DESC
      LIMIT $1 OFFSET $2
    `;
    
    return await getRows(sql, [limit, offset]);
  }

  static async update(id, { title, content }, userId) {
    // First, create a revision of the current article
    const currentArticle = await this.findById(id);
    if (!currentArticle) {
      throw new Error('Article not found');
    }

    // Check if user is the author
    if (currentArticle.author_id !== userId) {
      throw new Error('Unauthorized: Only the author can edit this article');
    }

    // Create revision
    await this.createRevision(id, {
      title: currentArticle.title,
      content: currentArticle.content,
      createdBy: userId
    });

    // Update the article
    const sql = `
      UPDATE articles
      SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING id, title, content, created_by, created_at, updated_at
    `;
    
    const result = await query(sql, [title, content, id]);
    return result.rows[0];
  }

  static async deleteOne(id, userId) {
    // Check if user is the author
    const article = await this.findById(id);
    if (!article) {
      throw new Error('Article not found');
    }

    if (article.author_id !== userId) {
      throw new Error('Unauthorized: Only the author can delete this article');
    }

    const sql = 'DELETE FROM articles WHERE id = $1 RETURNING id';
    const result = await query(sql, [id]);
    return result.rows[0];
  }

  static async createRevision(articleId, { title, content, createdBy }) {
    const sql = `
      INSERT INTO article_revisions (article_id, title, content, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING id, article_id, title, content, created_by, created_at
    `;
    
    const result = await query(sql, [articleId, title, content, createdBy]);
    return result.rows[0];
  }

  static async getRevisions(articleId, userId) {
    // Check if user is the author
    const article = await this.findById(articleId);
    if (!article) {
      throw new Error('Article not found');
    }

    if (article.author_id !== userId) {
      throw new Error('Unauthorized: Only the author can view revision history');
    }

    const sql = `
      SELECT ar.id, ar.title, ar.content, ar.created_at,
             u.name as author_name
      FROM article_revisions ar
      LEFT JOIN users u ON ar.created_by = u.id
      WHERE ar.article_id = $1
      ORDER BY ar.created_at DESC
    `;
    
    return await getRows(sql, [articleId]);
  }

  static async createSummary(articleId, summary) {
    const sql = `
      INSERT INTO article_summaries (article_id, summary)
      VALUES ($1, $2)
      ON CONFLICT (article_id) DO UPDATE SET
        summary = EXCLUDED.summary,
        created_at = CURRENT_TIMESTAMP
      RETURNING id, article_id, summary, created_at
    `;
    
    const result = await query(sql, [articleId, summary]);
    return result.rows[0];
  }

  static async getSummary(articleId) {
    const sql = `
      SELECT id, article_id, summary, created_at
      FROM article_summaries
      WHERE article_id = $1
    `;
    
    return await getRow(sql, [articleId]);
  }

  static async search(query, limit = 20, offset = 0) {
    const searchTerm = `%${query}%`;
    const sql = `
      SELECT a.id, a.title, a.content, a.created_at, a.updated_at,
             u.name as author_name, u.id as author_id,
             LEFT(a.content, 200) as excerpt
      FROM articles a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.title ILIKE $1 OR a.content ILIKE $1
      ORDER BY a.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    return await getRows(sql, [searchTerm, limit, offset]);
  }

  static async getByAuthor(authorId, limit = 20, offset = 0) {
    const sql = `
      SELECT a.id, a.title, a.content, a.created_at, a.updated_at,
             u.name as author_name, u.id as author_id,
             LEFT(a.content, 200) as excerpt
      FROM articles a
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.created_by = $1
      ORDER BY a.created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    return await getRows(sql, [authorId, limit, offset]);
  }

  static async getCount() {
    const sql = 'SELECT COUNT(*) as count FROM articles';
    const result = await query(sql);
    return parseInt(result.rows[0].count);
  }
}

export default Article; 