import Cart from "../models/Cart";
import Product, { IProduct } from "../models/Product";
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
  },
  getCart: async (userId: string) => {
    // 查找用戶購物車
    const cart = await Cart.findOne({ user: userId }).populate<{ product: IProduct }>({
      path: "items.product",
      select: "name image price origin_price quantity unit isEnabled"
    });

    if (!cart) {
      // 空購物車
      return {
        items: [],
        totalItems: 0,
        totalPrice: 0
      };
    }

    // 計算統計資訊
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 檢查有效商品
    const validItems = cart.items.filter((item) => {
      const product = item.product as unknown as IProduct;
      return product && product.isEnabled && product.quantity > 0;
    });

    // 如果有失效商品，更新購物車
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // 轉換 _id 為 id
    const transformedItems = validItems.map((item) => {
      const product = item.product as unknown as IProduct;
      return {
        product: {
          id: product._id,
          name: product.name,
          image: product.image,
          quantity: product.quantity,
          price: product.price,
          origin_price: product.origin_price,
          isEnabled: product.isEnabled,
          unit: product.unit
        },
        quantity: item.quantity,
        price: item.price
      };
    });

    return {
      items: transformedItems,
      totalItems,
      totalPrice,
      itemCount: transformedItems.length
    };
  },
  updateItemQuantity: async (
    userId: string,
    productId: string,
    quantity: number
  ) => {
    if (!productId || typeof quantity !== "number") {
      throw new HttpError(400, "商品 ID 與數量為必填項目");
    }

    if (quantity < 1) {
      throw new HttpError(400, "商品數量必須大於 0");
    }

    // 查找購物車
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new HttpError(404, "購物車不存在");
    }

    // 查找商品
    const product = await Product.findById(productId);
    if (!product) {
      throw new HttpError(404, "商品不存在");
    }
    if (!product.isEnabled) {
      throw new HttpError(400, "此商品已停售");
    }
    if (product.quantity !== undefined && product.quantity < quantity) {
      throw new HttpError(400, `庫存不足，目前僅剩 ${product.quantity} 件`);
    }

    // 查找購物車中的商品
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      throw new HttpError(404, "購物車中沒有此商品");
    }

    // 更新數量與價格
    cart.items[itemIndex].quantity = quantity;
    cart.items[itemIndex].price = product.price;

    await cart.save();

    // 回傳更新後的購物車（包含商品詳情）
    const updatedCart = await Cart.findById(cart._id).populate<{ product: IProduct }>({
      path: "items.product",
      select: "name image price origin_price quantity unit isEnabled"
    });

    // 轉換 _id 為 id
    const transformedItems = updatedCart?.items.map((item) => {
      const prod = item.product as unknown as IProduct;
      return {
        product: {
          id: prod._id,
          name: prod.name,
          image: prod.image,
          quantity: prod.quantity,
          price: prod.price,
          origin_price: prod.origin_price,
          isEnabled: prod.isEnabled,
          unit: prod.unit
        },
        quantity: item.quantity,
        price: item.price
      };
    });

    return transformedItems;
  },
  removeItem: async (userId: string, productId: string) => {
    if (!productId) {
      throw new HttpError(400, "商品 ID 為必填項目");
    }

    // 查找購物車
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new HttpError(404, "購物車不存在");
    }

    // 查找購物車中的商品
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      throw new HttpError(404, "購物車中沒有此商品");
    }

    // 移除該商品
    cart.items.splice(itemIndex, 1);
    await cart.save();

    // 回傳更新後的購物車（包含商品詳情）
    const updatedCart = await Cart.findById(cart._id).populate<{ product: IProduct }>({
      path: "items.product",
      select: "name image price origin_price quantity unit isEnabled"
    });

    const transformedItems = updatedCart?.items.map((item) => {
      const prod = item.product as unknown as IProduct;
      return {
        product: {
          id: prod._id,
          name: prod.name,
          image: prod.image,
          quantity: prod.quantity,
          price: prod.price,
          origin_price: prod.origin_price,
          isEnabled: prod.isEnabled,
          unit: prod.unit
        },
        quantity: item.quantity,
        price: item.price
      };
    });

    return transformedItems;
  },
  clearCart: async (userId: string) => {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return {
        items: []
      };
    }

    cart.items = [];
    await cart.save();

    return {
      items: []
    };
  }
};