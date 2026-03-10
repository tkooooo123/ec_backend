import { Request, Response } from "express";
import { categoryService } from "../services/caterogyService";

export const categoryController = {
    getCategories: async (_req: Request, res: Response) => {
        try {
          const categories = await categoryService.getCategories();
          res.status(200).json({
            success: true,
            data: categories
          });
        } catch (err: any) {
          res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
          });
        }
    },
    
}