import Category, { ICategory } from "../models/Category";
import { HttpError } from "../utils/HttpError";

export const categoryService = {
    getCategories: async (): Promise<ICategory[]> => {
        const categories = await Category.find();
    
        if (!categories) {
          throw new HttpError(404, "Categories not found");
        }
    
        return categories;
      }
}