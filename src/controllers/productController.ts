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
    getProduct: async (req: Request, res: Response) => {
        try {
          const productId = req.params.id; // 從路由參數取得 ID
          if (!productId || Array.isArray(productId)) {
            return res.status(400).json({ message: "無效的商品 ID" });
          }
    
          const product = await productService.getProductById(productId);
    
          // 格式化回傳資料
          const data = {
            id: product._id,
            name: product.name,
            image: product.image,
            imagesUrl: product.imagesUrl,
            description: product.description,
            content: product.content,
            quantity: product.quantity,
            price: product.price,
            origin_price: product.origin_price,
            unit: product.unit,
            is_hottest: product.is_hottest,
            is_newest: product.is_newest,
            notice: product.notice,
            material: product.material,
            size: product.size,
            style: product.style,
            category: product.category
              ? {
                  id: product.category._id?.toString() || "",
                  name: product.category.name || "",
                  description: product.category.description || "",
                }
              : null,
            createdAt: product.createdAt,
          };
    
          res.status(200).json({ message: "取得成功!", data });
        } catch (err: any) {
          res.status(err.statusCode || 500).json({
            message: err.message || "無法取得商品資訊，請稍後再試",
          });
        }
      },
}