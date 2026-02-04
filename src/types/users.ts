import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string(),
	phone: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type UserUpdate = Partial<
	Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'email'>
>;
