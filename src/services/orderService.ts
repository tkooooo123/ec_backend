import Order, { IOrder } from "../models/Order";
import { IUser } from "../models/User";
import { IProduct } from "../models/Product";
import { HttpError } from "../utils/HttpError";

type PopulatedOrder = Omit<IOrder, "user"> & { user: IUser };

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
  };