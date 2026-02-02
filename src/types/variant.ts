import { z } from 'zod';

export const variantSchema = z.object({
	id: z.string(),
	size: z.string(),
	color: z.string(),
	stock: z.number(),
	images: z.array(z.string()),
	productId: z.string(),
});

export type Variant = z.infer<typeof variantSchema>;
