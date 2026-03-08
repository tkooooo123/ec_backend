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
}
