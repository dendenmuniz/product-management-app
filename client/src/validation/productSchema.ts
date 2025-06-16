import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),

  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),

  stock: z
    .number()
    .min(0, "Quantity must be 0 or more"),

  merchantId: z.string().min(1, "Merchant is required"),

  supplierModelNumber: z.string().min(1, "Model number is required"),

  // optionals
  description: z.string().optional(),
  variantId: z.string().optional(),
  ean: z.array(z.string()).optional(),
  size: z.string().optional(),
  vendor: z.string().optional(),
  productType: z.array(z.string()).optional(),
  productGroup: z.array(z.string()).optional(),
  department: z.array(z.string()).optional(),
  imageUrl: z
  .string()
  .url("Image URL must be a valid URL")
  .optional()
  .or(z.literal("")), 
  msc: z.boolean().optional(),
});

export type ProductFormData = z.infer<typeof productSchema>;
