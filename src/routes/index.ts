import express from "express";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes"
import productRoutes from "./productRoutes";
import orderRoutes from "./orderRoutes";
import cartRoutes from "./cartRoutes";
import adminRoutes from "./adminRoutes";


const router = express.Router();


router.use("/auth", authRoutes); 
router.use("/admin", adminRoutes); 
router.use("/categories", categoryRoutes); 
router.use("/cart", cartRoutes); 
router.use("/products", productRoutes);
router.use("/orders", orderRoutes);

export default router;