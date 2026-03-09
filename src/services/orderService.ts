import Order, { IOrder } from "../models/Order";
import { IUser } from "../models/User";
import { IProduct } from "../models/Product";
import { HttpError } from "../utils/HttpError";
import { Types } from "mongoose";

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
};
