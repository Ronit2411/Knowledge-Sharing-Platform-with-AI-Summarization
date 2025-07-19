import { Router } from 'express';
import authRoutes from "./auth.js";
import articleRoutes from "./articles.js"; 

const router = Router();

// Public routes
router.use("/auth", authRoutes);
router.use("/articles", articleRoutes);

export default router; 