import { z } from 'zod';

export const productSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	discount: z.number(),
	category: z.string(),
	size: z.string(),
	stock: z.number(),
	images: z.array(z.string()).nullable(),
	isActive: z.boolean(),
	showStock: z.boolean(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;

export type ProductCreate = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductUpdate = Partial<ProductCreate>;
