import { Request, Response } from "express";
import { productService } from "../services/productService";

export const productController = {
    getProducts: async (_req: Request, res: Response) => {
        try {
          const products = await productService.getProducts();
    
          res.status(200).json({
            message: "取得成功!",
            data: {
              products,
            },
          });
        } catch (err: any) {
          res.status(err.statusCode || 500).json({
            message: err.message || "無法取得商品列表，請稍後再試",
          });
        }
      },
}