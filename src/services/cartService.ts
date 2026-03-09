import Cart from "../models/Cart";
import Product from "../models/Product";
import { Types } from "mongoose";
import { HttpError } from "../utils/HttpError";

export const cartService = {
  addToCart: async (userId: string, productId: string, quantity: number = 1) => {
    if (!productId) throw new HttpError(400, "商品 ID 為必填項目");
    if (quantity < 1) throw new HttpError(400, "商品數量必須大於 0");

    const product = await Product.findById(productId);
    if (!product) throw new HttpError(404, "商品不存在");
    if (!product.isEnabled) throw new HttpError(400, "此商品已停售");

    if (product.quantity !== undefined && product.quantity < quantity) {
      throw new HttpError(400, `庫存不足，目前僅剩 ${product.quantity} 件`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (product.quantity !== undefined && product.quantity < newQuantity) {
        throw new HttpError(400, `庫存不足，無法加入 ${quantity} 件商品`);
      }
      cart.items[existingItemIndex].quantity = newQuantity;
      cart.items[existingItemIndex].price = product.price;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
        price: product.price
      });
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: "items.product",
      select: "name image price quantity unit isEnabled"
    });

    return updatedCart;
  }
};