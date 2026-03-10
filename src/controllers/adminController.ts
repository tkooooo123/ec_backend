import { Request, Response } from "express";
import { categoryService } from "../services/caterogyService";

export const adminController = {
    getCategories: async (req: Request, res: Response) => {
        const categories = await categoryService.getCategories();
      
        res.json({
          success: true,
          data: categories
        });
    },
}