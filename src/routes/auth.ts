import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { authController } from '@/controllers/auth.js';
import { loginSchema, registerSchema } from '@/types/auth.js';
import { ErrorSchema } from '@/types/error.js';

export async function authRoute(server: FastifyInstance) {
	server.post(
		'/register',
		{
			schema: {
				description: 'Register a new user',
				body: registerSchema,
				response: {
					201: z.object({ message: z.string() }),
					400: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Auth'],
			},
		},
		authController.register,
	);

	server.post(
		'/login',
		{
			schema: {
				description: 'Login a user and generate a token',
				body: loginSchema,
				response: {
					200: z.object({ token: z.string() }),
					401: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Auth'],
			},
		},
		authController.login,
	);
}
