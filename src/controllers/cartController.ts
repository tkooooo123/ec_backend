import { Request, Response } from "express";
import { cartService } from "../services/cartService";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const cartController = {
  addToCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      const { productId, quantity = 1 } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "未授權",
        });
      }

      const cart = await cartService.addToCart(userId, productId, quantity);

      return res.status(200).json({
        success: true,
        message: "商品已成功加入購物車",
        data: cart,
      });
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        message: err.message || "伺服器錯誤，請稍後再試",
      });
    }
  },
  getCart: async (req: AuthRequest, res: Response) => {
    try {
      // Auth middleware 已經把 userId 放在 req.user.id
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "未授權" });
      }

      const data = await cartService.getCart(userId);

      return res.status(200).json({
        success: true,
        message: "成功獲取購物車",
        data
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "獲取購物車失敗"
      });
    }
  },
  updateItemQuantity: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "未授權" });
      }

      const { productId, quantity } = req.body;

      const items = await cartService.updateItemQuantity(userId, productId, quantity);

      return res.status(200).json({
        success: true,
        message: "商品數量已更新",
        data: { items }
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "變更購物車商品數量失敗"
      });
    }
  },
  removeItem: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "未授權" });
      }

      const { productId } = req.body;

      const items = await cartService.removeItem(userId, productId);

      return res.status(200).json({
        success: true,
        message: "商品已從購物車移除",
        data: { items }
      });
    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "刪除購物車商品失敗"
      });
    }
  },
  clearCart: async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "未授權"
        });
      }

      const data = await cartService.clearCart(userId);

      return res.json({
        success: true,
        message: "購物車已清空",
        data
      });

    } catch (err: any) {
      return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "清空購物車失敗"
      });
    }
  }
};
