import Product, { IProduct } from "../models/Product";
import { ICategory } from "../models/Category";
import { HttpError } from "../utils/HttpError";

export const productService = {
    getProducts: async (): Promise<(IProduct & { category: ICategory | null })[]> => {
    
        const products = await Product.find()
          .sort({ createdAt: -1 })
          .populate("category"); // 帶出分類資訊
    
        if (!products) {
          throw new HttpError(404, "無法取得商品列表");
        }
    
        return products as (IProduct & { category: ICategory | null })[];
    },
    getProductById: async (productId: string): Promise<IProduct & { category: ICategory | null }> => { 
        // 驗證 ID 格式
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
          throw new HttpError(400, "無效的商品 ID 格式");
        }
    
        // 查詢商品
        const product = (await Product.findById(productId).populate("category")) as
          | (IProduct & { category: ICategory })
          | null;
    
        if (!product) {
          throw new HttpError(404, "找不到該商品");
        }
    
        // 檢查商品是否啟用
        if (!product.isEnabled) {
          throw new HttpError(404, "該商品已下架");
        }
    
        return product;
    },
    deleteProduct: async (id: string) => {

      if (!id) {
        throw new HttpError(400, "缺少產品 ID");
      }
  
      const deleted = await Product.findByIdAndDelete(id);
  
      if (!deleted) {
        throw new HttpError(404, "找不到該產品");
      }
  
    }
}
