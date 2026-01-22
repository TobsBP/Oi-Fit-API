import { z } from 'zod';

export const productSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	price: z.number(),
	isActive: z.boolean(),
	categoryId: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
