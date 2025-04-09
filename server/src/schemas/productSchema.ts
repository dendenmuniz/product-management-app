import { z } from 'zod';

export const productSchema = z.object({
  merchantId: z.string().optional(),
  variantId: z.string().optional(),
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
  supplierModelNumber: z.string().optional(),
  ean: z.array(z.string()).default([]),
  size: z.string().optional(),
  vendor: z.string().optional(),
  stock: z.coerce.number().int().nonnegative({ message: 'Stock cannot be negative' }),
  productType: z.array(z.string()).default([]),
  productGroup: z.array(z.string()).default([]),
  department: z.array(z.string()).default([]),
  variantCreated: z.coerce.date().optional(),
  variantUpdated: z.coerce.date().optional(),
  inventoryLevelCreated: z.coerce.date().optional(),
  inventoryLevelUpdated: z.coerce.date().optional(),
  imageUrl: z.string().url().optional(),
  price: z.coerce.number().positive({ message: 'Price must be greater than zero' }),
  description: z.string().optional(),
  msc: z.boolean().optional().default(false)
});
