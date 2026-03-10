import Category, { ICategory } from "../models/Category";
import { HttpError } from "../utils/HttpError";

export const categoryService = {
    getCategories: async (): Promise<ICategory[]> => {
        const categories = await Category.find();
    
        if (!categories) {
          throw new HttpError(404, "Categories not found");
        }
    
        return categories;
    },
    createCategory: async (name: string, description: string) => {

      if (!name) {
        throw new HttpError(400, "請輸入分類名稱");
      }
  
      if (!description) {
        throw new HttpError(400, "請輸入分類描述");
      }
  
      const found = await Category.findOne({ name });
  
      if (found) {
        throw new HttpError(400, "分類名稱已存在，請重新輸入");
      }
  
      const category = await Category.create({
        name,
        description
      });
  
      return category;
    }
}