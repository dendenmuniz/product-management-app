import { Router } from "express";
import { forgotPassword, login, register, resetPassword } from "../controllers/authController";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post('/reset-password', resetPassword);
router.post('/forgot-password', forgotPassword);

export default router;
