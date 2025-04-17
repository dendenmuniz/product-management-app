import { Router, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middlewares/authMiddleware";
import { productSchema } from "../schemas/productSchema";
import { createError } from "../middlewares/errorHandler";
import { z } from "zod";


const prisma = new PrismaClient();

// Helper function to check if user is authenticated
function requireUserOrFail(req: Request, next: NextFunction) {
  if (!req.user) {
    next(createError("Unauthorized - Missing user", 401));
    throw new Error(); 
  }
  return req.user;
}

function normalizeProduct(p: any) {
  return {
    merchantId: p.merchant_id,
    variantId: p.variant_id?.toString(),
    name: p.product_name,
    supplierModelNumber: p.supplier_model_number,
    ean: p.ean,
    size: p.size,
    vendor: p.vendor,
    stock: p.quantity,
    productType: p.product_type,
    productGroup: p.product_group,
    department: p.department,
    variantCreated: p.variant_created,
    variantUpdated: p.variant_updated,
    inventoryLevelCreated: p.inventory_level_created,
    inventoryLevelUpdated: p.inventory_level_updated,
    imageUrl: p.image_url,
    price: parseFloat(p.price),
    description: p.product_description,
    msc: p.msc,
  };
}

function validUUID(id: string) {
  const uuidRegex = /^[0-9a-fA-F-]{36}$/;
  return uuidRegex.test(id);
}
// Create product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId, role } = requireUserOrFail(req, next);

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
        userId,
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
  try {
    const { id: userId } = requireUserOrFail(req, next);

    const { fileName, uploadDate, products } = req.body;

    const normalizedProducts = products.map(normalizeProduct);

    const productArraySchema = z.array(productSchema);
    const parsed = productArraySchema.safeParse(normalizedProducts);

    if (!parsed.success) {
      return next(
        createError("Validation failed", 400, parsed.error.flatten())
      );
    }

    const validatedProducts = parsed.data;

    // Create a new import log entry
    const importLog = await prisma.productImportLog.create({
      data: {
        fileName,
        uploadedAt: new Date(uploadDate),
        uploadedBy: userId,
        totalItems: validatedProducts.length,
      },
    });

    // Create products in the database
    const created = await prisma.product.createMany({
      data: validatedProducts.map((p) => ({
        ...p,
        userId,
        importLogId: importLog.id,
      })),
      skipDuplicates: true,
    });

    res.status(201).json({
      message: "Products imported",
      count: created.count,
      fileName,
      uploadedAt: importLog.uploadedAt,
    });
  } catch (err) {
    next(err);
  }
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

  if (validUUID(id) === false) {
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
    const { id: userId, role } = requireUserOrFail(req, next);
    const { id } = req.params;

    if (validUUID(id) === false) {
      return next(createError("Invalid product ID", 400));
    }

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

export const bulkUpdateProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    
    const { products } = req.body;

   
    if (!Array.isArray(products) || products.length === 0) {
      return next(createError("No products to update", 400));
    }

    const ids = products.map((p: { id: string }) => p.id);
    const updates = {} as Partial<{ msc: boolean; price: number }>;

    if (products.some((p: { id: string }) => validUUID(p.id) === false)) {
      return next(createError("Invalid product ID", 400));
    }
    
    if ("msc" in products[0]) updates.msc = products[0].msc;
    if ("price" in products[0]) updates.price = products[0].price;

    if (Object.keys(updates).length === 0) {
      return next(createError("No update fields provided", 400));
    }

    await prisma.product.updateMany({
      where: {
        id: { in: ids },
        userId: req.user!.id, 
      },
      data: updates,
    });

    res.status(200).json({ message: "Bulk update successful" });
  } catch (err) {
    console.error(err);
    return next(createError("Failed to process bulk update", 500));
  }
};


// Delete
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id: userId, role } = requireUserOrFail(req, next);
    const { id } = req.params;

    if (validUUID(id) === false) {
      return next(createError("Invalid product ID", 400));
    }

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
