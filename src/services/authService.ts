import User, { IUser } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { HttpError } from "../utils/HttpError";

export const registerService = async (name: string, email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new HttpError(401,"Email already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "30m" });

  return { user, token };
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new HttpError(401, "User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new HttpError(401, "Incorrect password");

  const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "30m" });

  return { user, token };
};