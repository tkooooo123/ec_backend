import { Request, Response } from "express";
import { registerService, loginService } from "../services/authService";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const data = await registerService(name, email, password);
    res.status(201).json({ success: true, ...data });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const data = await loginService(email, password);
    res.status(200).json({ success: true, ...data });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ success: false, message: err.message });
  }
};

export const logout = async (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Logged out" });
};