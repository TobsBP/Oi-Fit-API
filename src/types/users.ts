import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	phone: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
