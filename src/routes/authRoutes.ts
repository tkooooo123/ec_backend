import express from "express";
import { register, login, logout } from "../controllers/authController";

const router = express.Router();

/**
 * @route   POST /auth/register
 * @desc    註冊新使用者
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /auth/login
 * @desc    登入使用者
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   POST /auth/logout
 * @desc    登出使用者
 * @access  Public / 可改成 Protected
 */
router.post("/logout", logout);

export default router;