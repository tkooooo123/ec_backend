import Order, { IOrder } from "../models/Order";
import { IUser } from "../models/User";
import Product, { IProduct } from "../models/Product";
import Cart from "../models/Cart";
import { HttpError } from "../utils/HttpError";
import mongoose, { Types } from "mongoose";

type PopulatedOrder = Omit<IOrder, "user"> & { user: IUser };
interface OrderDetail {
  id: Types.ObjectId;

  user: {
    userId: Types.ObjectId;
    name: string;
    email: string;
  };

  items: {
    name: string;
    quantity: number;
    price: number;
  }[];

  total: number;
  shipping: any;
  status: string;
  payment: string;
  sn: string;
  createdAt: Date;
}

export const orderService = {
  getOrdersByUser: async (userId: string): Promise<PopulatedOrder[]> => {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate<{ user: IUser }>("user")
      .populate("items.product")
      .lean();

    if (!orders) {
      throw new HttpError(404, "查無訂單");
    }

    return orders;
  },
  getOrderById: async (id: string): Promise<OrderDetail> => {
    const order = await Order.findById(id)
      .populate<{ user: IUser }>("user")
      .populate<{ product: IProduct }>("items.product")
      .lean();

    if (!order) {
      throw new HttpError(404, "找不到訂單");
    }
    const result = {
      id: order._id,
      user: {
        userId: order.user._id,
        name: order.user.name,
        email: order.user.email
      },
      items: order.items.map((item) => {
        const product = item.product as unknown as IProduct;
  
        return {
          name: product.name,
          quantity: item.quantity,
          price: item.price
        };
      }),
      total: order.total,
      shipping: order.shipping,
      status: order.status,
      payment: order.payment,
      sn: order.sn,
      createdAt: order.createdAt
    };
  
    return result;
  },
  createOrder: async (
    userId: string,
    shipping: any,
    payment: string
  ) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

      if (
        !shipping ||
        !shipping.name ||
        !shipping.phone ||
        !shipping.address ||
        !shipping.email
      ) {
        throw new HttpError(400, "收件人資訊不完整");
      }

      if (!payment) {
        throw new HttpError(400, "未選擇付款方式");
      }

      const cart = await Cart.findOne({ user: userId })
        .populate<{ product: IProduct }>({
          path: "items.product",
          select: "price isEnabled quantity name"
        })
        .session(session);

      if (!cart || !cart.items.length) {
        throw new HttpError(400, "購物車沒有商品");
      }

      let total = 0;

      const orderItems = cart.items.map((item) => {
        const product = item.product as unknown as IProduct;

        if (!product.isEnabled) {
          throw new HttpError(400, `商品「${product.name}」已停售`);
        }

        if (product.quantity !== undefined && product.quantity < item.quantity) {
          throw new HttpError(400, `商品「${product.name}」庫存不足`);
        }

        total += item.price * item.quantity;

        return {
          product: product._id,
          quantity: item.quantity,
          price: item.price
        };
      });

      // 建立訂單
      const order = await Order.create(
        [
          {
            user: userId,
            items: orderItems,
            total,
            shipping,
            payment
          }
        ],
        { session }
      );

      // 扣庫存
      for (const item of orderItems) {
        const updated = await Product.findOneAndUpdate(
          {
            _id: item.product,
            quantity: { $gte: item.quantity }
          },
          {
            $inc: { quantity: -item.quantity }
          },
          { new: true, session }
        );

        if (!updated) {
          throw new HttpError(400, "商品庫存不足");
        }
      }

      // 清空購物車
      cart.items = [];
      await cart.save({ session });

      await session.commitTransaction();
      session.endSession();

      return {
        orderId: order[0]._id
      };

    } catch (error) {

      await session.abortTransaction();
      session.endSession();

      throw error;
    }
  }
};
