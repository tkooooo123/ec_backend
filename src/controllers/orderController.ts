import { Request, Response } from "express";
import { orderService } from "../services/orderService";
import { IProduct } from "../models/Product";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}
export const orderController = {
  getOrders: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "未授權" });
      }

      const orders = await orderService.getOrdersByUser(userId);

      // 格式化回傳資料
      const data = orders.map((order: any) => ({
        id: order._id,
        user: {
          userId: order.user._id,
          name: order.user.name,
          email: order.user.email,
        },
        items: order.items.map((item: any) => {
          const product = item.product as IProduct;
          return {
            id: item.product?._id,
            name: product?.name,
            image: product?.image,
            quantity: item.quantity,
            price: item.price,
            unit: product?.unit,
          };
        }),
        total: order.total,
        shipping: order.shipping,
        status: order.status,
        payment: order.payment,
        sn: order.sn,
        createdAt: order.createdAt,
      }));

      res.status(200).json({ message: "取得成功!", data });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        message: err.message || "伺服器錯誤，請稍後再試",
      });
    }
  },
  getOrder: async(req: AuthRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      if (!id) {
        return res.status(400).json({
          success: false,
          message: "缺少訂單 ID"
        });
      }
      const order = await orderService.getOrderById(id);
  
      res.status(200).json({
        success: true,
        message: "取得成功!",
        data: order
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        message: err.message || "伺服器錯誤，請稍後再試",
      });
    }
  },
  createOrder: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "未授權"
        });
      }

      const { shipping, payment } = req.body;

      const data = await orderService.createOrder(
        userId,
        shipping,
        payment
      );

      return res.status(201).json({
        success: true,
        message: "訂單建立成功",
        data
      });

    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "建立訂單失敗"
      });
    }
  }
};