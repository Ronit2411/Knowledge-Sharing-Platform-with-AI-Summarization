import { Router } from 'express';
import validation from '../middleware/validation.js';
import auth from "../middleware/auth.js";
import articleController from "../controllers/articleController.js";

const { validate, validateQuery, validateParams, paramSchemas } = validation;
const { authenticateToken, optionalAuth } = auth;
const {
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
  getArticleSummary,
} = articleController;

const router = Router();

// Public routes (with optional authentication)
router.get('/', optionalAuth, validateQuery('pagination'), getAllArticles);
router.get('/search', optionalAuth, validateQuery('search'), searchArticles);
router.get('/:id', optionalAuth, validateParams(paramSchemas.id), getArticleById);
router.get('/:id/summary', optionalAuth, validateParams(paramSchemas.id), getArticleSummary);
router.get('/author/:authorId', optionalAuth, validateQuery('pagination'), getArticlesByAuthor);

// Protected routes
router.post('/', authenticateToken, validate('article'), createArticle);
router.put('/:id', authenticateToken, validateParams(paramSchemas.id), validate('articleUpdate'), updateArticle);
router.delete('/:id', authenticateToken, validateParams(paramSchemas.id), deleteArticle);
router.post('/:id/summary', authenticateToken, validateParams(paramSchemas.id), generateSummary);
router.get('/:id/revisions', authenticateToken, validateParams(paramSchemas.id), getArticleRevisions);
router.get('/my/articles', authenticateToken, validateQuery('pagination'), getMyArticles);

export default router; 