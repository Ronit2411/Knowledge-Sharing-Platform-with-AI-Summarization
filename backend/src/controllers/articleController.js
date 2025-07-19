import Article from "../models/Article.js";
import aiService from '../utils/ai.js';

const { generateSummaryWithFallback } = aiService;
import errorHandler from '../middleware/errorHandler.js';

const { asyncHandler, createError } = errorHandler;

// Get all articles with pagination
const getAllArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const [articles, totalCount] = await Promise.all([
    Article.getAll(limit, offset),
    Article.getCount()
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  res.json({
    articles,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalCount,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  });
});

// Get single article by ID
const getArticleById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const article = await Article.findById(id);
  if (!article) {
    throw createError.notFound('Article not found');
  }

  res.json({ article });
});

// Create new article
const createArticle = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const createdBy = req.user.id;

  const article = await Article.create({ title, content, createdBy });

  res.status(201).json({
    message: 'Article created successfully',
    article
  });
});

// Update article
const updateArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const userId = req.user.id;

  const article = await Article.update(id, { title, content }, userId);

  res.json({
    message: 'Article updated successfully',
    article
  });
});

// Delete article
const deleteArticle = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  await Article.deleteOne(id, userId);

  res.json({
    message: 'Article deleted successfully'
  });
});

// Generate AI summary for article
const generateSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if article exists
  const article = await Article.findById(id);
  if (!article) {
    throw createError.notFound('Article not found');
  }

  // Check if summary already exists
  const existingSummary = await Article.getSummary(id);
  if (existingSummary) {
    return res.json({
      message: 'Summary retrieved from cache',
      summary: existingSummary.summary,
      cached: true,
      createdAt: existingSummary.created_at
    });
  }

  // Generate new summary using AI
  const summary = await generateSummaryWithFallback(article.content);

  // Save summary to database
  const savedSummary = await Article.createSummary(id, summary);

  res.json({
    message: 'Summary generated successfully',
    summary: savedSummary.summary,
    cached: false,
    createdAt: savedSummary.created_at
  });
});

// Get article revision history
const getArticleRevisions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const revisions = await Article.getRevisions(id, userId);

  res.json({
    revisions
  });
});

// Search articles
const searchArticles = asyncHandler(async (req, res) => {
  const { q, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  if (!q || q.trim().length === 0) {
    throw createError.badRequest('Search query is required');
  }

  const articles = await Article.search(q.trim(), limit, offset);

  res.json({
    articles,
    searchQuery: q,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      hasNext: articles.length === limit
    }
  });
});

// Get articles by author
const getArticlesByAuthor = asyncHandler(async (req, res) => {
  const { authorId } = req.params;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const articles = await Article.getByAuthor(authorId, limit, offset);

  res.json({
    articles,
    authorId: parseInt(authorId),
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      hasNext: articles.length === limit
    }
  });
});

// Get user's own articles
const getMyArticles = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;

  const articles = await Article.getByAuthor(userId, limit, offset);

  res.json({
    articles,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      hasNext: articles.length === limit
    }
  });
});

// Get article summary (cached or generate new)
const getArticleSummary = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check if article exists
  const article = await Article.findById(id);
  if (!article) {
    throw createError.notFound('Article not found');
  }

  // Try to get cached summary
  const cachedSummary = await Article.getSummary(id);
  if (cachedSummary) {
    return res.json({
      summary: cachedSummary.summary,
      cached: true,
      createdAt: cachedSummary.created_at
    });
  }

  // Generate new summary
  const summary = await generateSummaryWithFallback(article.content);
  const savedSummary = await Article.createSummary(id, summary);

  res.json({
    summary: savedSummary.summary,
    cached: false,
    createdAt: savedSummary.created_at
  });
});

export default {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  generateSummary,
  getArticleRevisions,
  searchArticles,
  getArticlesByAuthor,
  getMyArticles,
  getArticleSummary
}; 