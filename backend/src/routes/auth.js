import { Router } from 'express';
import validation from '../middleware/validation.js';

const { validate } = validation;
import auth from "../middleware/auth.js";
import authController from '../controllers/authController.js';

const { authenticateToken } = auth;
const { signup, login, logout, getProfile, updateProfile, changePassword } = authController;

const router = Router();

// Public routes
router.post('/signup', validate('signup'), signup);
router.post('/login', validate('login'), login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validate('signup'), updateProfile);
router.post('/change-password', authenticateToken, changePassword);

export default router; 