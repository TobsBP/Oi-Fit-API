import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email('Invalid email'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const registerSchema = z.object({
	email: z.email('Invalid email'),
	name: z.string().min(2, 'Name must be at least 2 characters long'),
	phone: z.string().min(10, 'Phone number must be at least 10 characters long'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
