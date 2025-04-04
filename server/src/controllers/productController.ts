import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware";
import { productSchema } from "../schemas/productSchema";
import { createError } from "../middlewares/errorHandler";
import { z } from "zod";

const prisma = new PrismaClient();

// Create product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, id } = req.user!;

    if (role !== "seller") {
      return next(
        createError("Unauthorized - Only sellers can create products", 403)
      );
    }

    const result = productSchema.safeParse(req.body);

    if (!result.success) {
      return next(createError("Invalid data", 400, result.error.flatten()));
    }

    const product = await prisma.product.create({
      data: {
        ...result.data,
        userId: id,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    return next(createError("Internal server error", 500));
  }
};

// Import multiple products
export const importProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productArraySchema = z.array(productSchema);
  const parsed = productArraySchema.safeParse(req.body);

  if (!parsed.success) {
    return next(createError("Validation failed", 400, parsed.error.flatten()));
  }

  const products = parsed.data;
  const created = await prisma.product.createMany({
    data: products.map((p) => ({
      ...p,
      userId: req.user?.id || "anonymous",
    })),
    skipDuplicates: true,
  });

  res.status(201).json({ message: "Products imported", count: created.count });
};

// Get all
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
    return;
  } catch (error) {
    console.error(error);
    return next(createError("Error retrieving products", 500));
  }
};

// Get by id
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id.match(/^[0-9a-fA-F-]{36}$/)) {
    return next(createError("Invalid product ID", 400));
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return next(createError("Product not found", 404));
  }

  res.status(200).json(product);
};

// Update
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId, role } = req.user!;
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return next(createError("Product not found", 404));
    }

    if (product.userId !== userId && role !== "admin") {
      return next(
        createError("Unauthorized - You can only update your own products", 403)
      );
    }

    const result = productSchema.partial().safeParse(req.body);
    if (!result.success) {
      return next(createError("Invalid data", 400, result.error.flatten()));
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { ...result.data },
    });
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return next(createError("Error updating product", 500));
  }
};

// Delete
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId, role } = req.user!;
    const { id } = req.params;

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return next(createError("Product not found", 404));
    }

    if (product.userId !== userId && role !== "admin") {
      return next(
        createError("Unauthorized - You can only delete your own products", 403)
      );
    }

    await prisma.product.delete({ where: { id } });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return next(createError("Error deleting product", 500));
  }
};
