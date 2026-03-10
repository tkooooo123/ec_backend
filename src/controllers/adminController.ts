import { Request, Response } from "express";
import { categoryService } from "../services/caterogyService";

interface AuthRequest extends Request {
    user?: { id: string; role: string };
}

export const adminController = {
    getCategories: async (req: Request, res: Response) => {
        const categories = await categoryService.getCategories();
      
        res.json({
          success: true,
          data: categories
        });
    },
    createCategory: async (req: AuthRequest, res: Response) => {
        try {
    
          const { name, description } = req.body;
    
          await categoryService.createCategory(name, description);
    
          res.status(201).json({
            success: true,
            message: "新增成功!"
          });
    
        } catch (err: any) {
          res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "伺服器錯誤"
          });
        }
    },
    updateCategory: async (req: AuthRequest, res: Response) => {
        try {
    
          const { id, name, description } = req.body;
    
          await categoryService.updateCategory(
            id,
            name,
            description
          );
    
          return res.status(200).json({
            success: true,
            message: "更新成功!"
          });
    
        } catch (err: any) {
    
          return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || "伺服器錯誤"
          });
    
        }
      }
}