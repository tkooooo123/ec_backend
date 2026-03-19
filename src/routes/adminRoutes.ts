import { Router } from "express";
import { adminController } from "../controllers/adminController";
import { adminAuth } from "../middlewares/authMiddleware";
import { productController } from "../controllers/productController";

const router = Router();

router.get("/categories", adminAuth, adminController.getCategories);
router.post("/category", adminAuth, adminController.createCategory);
router.put("/category", adminAuth, adminController.updateCategory);
router.delete("/category/:id", adminAuth, adminController.deleteCategory);
router.post("/product", adminAuth, productController.createProduct);
router.delete("/product", adminAuth, productController.deleteProduct);

export default router;
