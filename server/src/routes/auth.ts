import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { userSchema } from "../schemas/userShcema";
import { createError } from "../middlewares/errorHandler";

const router = Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET as string;

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = userSchema.safeParse(req.body);

      if (!result.success) {
        return next(createError("Invalid data", 400, result.error.format()));
      }

      const { name, email, password, role } = result.data;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return next(createError("User already exists", 400));
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(201).json({ token });
      return;
    } catch (error) {
      console.error(error);
      return next(createError("Internal server error", 500));
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return next(createError("Invalid credentials", 400));
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return next(createError("Invalid credentials", 400));
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token });
      return;
    } catch (error) {
      console.error(error);
      return next(createError("Internal server error", 500));
    }
  }
);

export default router;
