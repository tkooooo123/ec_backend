import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { HttpError } from "../utils/HttpError";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

interface JwtPayload {
  id: string;
  role?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HttpError(401, "未提供 token");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwtSecret!) as JwtPayload;
    req.user = { id: decoded.id, role: decoded.role || "user" }; // ✅
    next();
  } catch (err: any) {
    res.status(err.statusCode || 401).json({ message: err.message || "未授權" });
  }
};