import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { usersController } from '@/controllers/users.js';
import { authenticate } from '@/middleware.js';
import { ErrorSchema } from '@/types/error.js';
import { userSchema } from '@/types/users.js';

export async function usersRoute(server: FastifyInstance) {
	server.get(
		'/users',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Get all users',
				response: {
					200: z.array(userSchema),
					500: ErrorSchema,
				},
				tags: ['Users'],
			},
		},
		usersController.getAllUsers,
	);

	server.get(
		'/user/:id',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Get a user by ID',
				params: z.object({ id: z.uuid() }),
				response: {
					200: userSchema,
					404: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Users'],
			},
		},
		usersController.getUserById,
	);

	server.put(
		'/user/:id',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Update a user',
				params: z.object({ id: z.uuid() }),
				body: userSchema
					.omit({ id: true, createdAt: true, updatedAt: true, email: true })
					.partial(),
				response: {
					200: userSchema,
					400: ErrorSchema,
					404: ErrorSchema,
				},
				tags: ['Users'],
			},
		},
		usersController.updateUser,
	);

	server.patch(
		'/user/:id',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Partially update a user',
				params: z.object({ id: z.uuid() }),
				body: userSchema
					.omit({ id: true, createdAt: true, updatedAt: true, email: true })
					.partial(),
				response: {
					200: userSchema,
					400: ErrorSchema,
					404: ErrorSchema,
				},
				tags: ['Users'],
			},
		},
		usersController.updateUser,
	);

	server.delete(
		'/user/:id',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Delete a user',
				params: z.object({ id: z.uuid() }),
				response: {
					204: z.object({}),
					404: ErrorSchema,
				},
				tags: ['Users'],
			},
		},
		usersController.deleteUser,
	);
}
