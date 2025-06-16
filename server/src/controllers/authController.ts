import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
import { userSchema } from '../schemas/userSchema';
import { createError } from '../middlewares/errorHandler';


const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

// Util: create token
function generateToken(payload: { id: string; email: string; role: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
}

// Config nodemailer's transporter 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
  tls: {
    rejectUnauthorized: false,  //just for testing purposes, not for production
  },
});

// Register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = userSchema.safeParse(req.body);

    if (!result.success) {
      return next(createError('Invalid data', 400, result.error.format()));
    }

    const { name, email, password, role } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return next(createError('User already exists', 400));
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

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return next(createError("Internal server error", 500));
  }
};

// Login
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return next(createError('Invalid credentials', 400));
    }


    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    res.status(200).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error(error);
    return next(createError("Internal server error", 500));
  }
};

// Forgot password
export const forgotPassword =  async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(createError('User not found', 404));
    }

    // create reset token 
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires,
      },
    });

     // Send reset link 
     const resetLink = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
     const mailOptions = {
       to: email,
       from: process.env.EMAIL_USER,
       subject: 'Password Reset Request',
       text: `Hello,\n\n You are receiving this email because a password reset request was made for your account.\n\nPlease click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, you can safely ignore this email.\n Best regards,\nProduct Management App Team`,
     };
 
     await transporter.sendMail(mailOptions);
 
     res.status(200).json({ message: 'Password reset instructions have been sent to your email.' });
   } catch (error) {
     console.error(error);
     return next(createError('Failed to process request. Please try again later.', 500));
   }
 }



export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, token, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires! < new Date()) {
      return next(createError('Invalid Token', 400));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    res.status(200).json({ message: 'Your password has been successfully updated.' });
  } catch (error) {
    console.error(error);
    return next(createError('An error occurred while resetting the password. Please try again.', 500));
  }
}
