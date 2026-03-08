import express from "express";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes"
import productRoutes from "./productRoutes";

const router = express.Router();


router.use("/auth", authRoutes); 
router.use("/categories", categoryRoutes); 
router.use("/products", productRoutes);

export default router;