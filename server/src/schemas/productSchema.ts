import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: 'Price must be greater than zero' }),
  stock: z.coerce.number().int().nonnegative({ message: 'Stock cannot be negative' }),

  merchantId: z.string().optional(),
  variantId: z.string().optional(),
  supplierModelNumber: z.string().optional(),
  ean: z.array(z.string()).default([]),
  size: z.string().optional(),
  vendor: z.string().optional(),
  productType: z.array(z.string()).default([]),
  productGroup: z.array(z.string()).default([]),
  department: z.array(z.string()).default([]),
  imageUrl: z.string().url().optional(),

  variantCreated: z.coerce.date().optional(),
  variantUpdated: z.coerce.date().optional(),
  inventoryLevelCreated: z.coerce.date().optional(),
  inventoryLevelUpdated: z.coerce.date().optional()
});
