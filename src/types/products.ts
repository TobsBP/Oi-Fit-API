import { z } from 'zod';

export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  price: z.number().min(0).max(10000),
  isActive: z.boolean().default(true),
  categoryId: z.string(),
  createdAt: z.date().default(new Date()),
  updatedAt: z.date().default(new Date()),
});


