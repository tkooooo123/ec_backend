import express from "express";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes"

const router = express.Router();


router.use("/auth", authRoutes); 
router.use("/categories", categoryRoutes); 

export default router;