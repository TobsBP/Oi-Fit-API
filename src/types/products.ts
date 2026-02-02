import { z } from 'zod';
import { variantSchema } from './variant';

export const productSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	isActive: z.boolean(),
	categoryId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
	Variant: z.array(variantSchema),
});

export type Product = z.infer<typeof productSchema>;

export type ProductCreate = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type ProductUpdate = Partial<Product>;
