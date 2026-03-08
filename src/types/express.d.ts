import { IUser } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string }; // JWT 驗證後放入 req.user
    }
  }
}