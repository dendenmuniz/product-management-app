import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, { message: 'Name must have at least 3 characters' }),
  description: z.string().optional(),
  price: z.number().positive({ message: 'Price must be greater than zero' }),
  stock: z.number().int().nonnegative({ message: 'Stock cannot be negative' }),
});
