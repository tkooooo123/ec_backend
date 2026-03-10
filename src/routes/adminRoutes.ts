import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { adminAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/categories", adminAuth,adminController.getCategories)

export default router;