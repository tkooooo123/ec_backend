import express from "express";
import { orderController } from "../controllers/orderController";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authenticate, orderController.getOrders);
router.get("/:id", authenticate, orderController.getOrder);

export default router;