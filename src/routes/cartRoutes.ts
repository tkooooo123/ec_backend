import { Router } from "express";
import { cartController } from "../controllers/cartController";
import { authenticate } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authenticate, cartController.addToCart);

export default router;