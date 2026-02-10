import type { FastifyInstance } from 'fastify';
import z from 'zod';
import { ordersController } from '@/controllers/orders.js';
import { authenticate } from '@/middleware.js';
import { ErrorSchema } from '@/types/error.js';
import {
	createPaymentSchema,
	orderSchema,
} from '@/types/orders.js';

export async function ordersRoute(server: FastifyInstance) {
	server.get(
		'/orders',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Get all orders',
				response: {
					200: z.array(orderSchema),
					500: ErrorSchema,
				},
				tags: ['Orders'],
			},
		},
		ordersController.getAllOrders,
	);

	server.get(
		'/orders/me',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Get orders for the authenticated user',
				response: {
					200: z.array(orderSchema),
					401: ErrorSchema,
					500: ErrorSchema,
				},
				tags: ['Orders'],
			},
		},
		ordersController.getMyOrders,
	);

	server.post(
		'/order',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Create a payment intent and save orders',
				body: createPaymentSchema,
				response: {
					200: z.object({ clientSecret: z.string() }),
					400: ErrorSchema,
					401: ErrorSchema,
				},
				tags: ['Orders'],
			},
		},
		ordersController.createPayment,
	);

	server.put(
		'/order/:id',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Update an order',
				body: orderSchema
					.omit({ id: true, createdAt: true, updatedAt: true })
					.partial(),
				response: {
					200: orderSchema,
					400: ErrorSchema,
				},
				tags: ['Orders'],
			},
		},
		ordersController.updateOrder,
	);

	server.delete(
		'/order/:id',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Delete an order',
				response: {
					204: z.object({}),
					400: ErrorSchema,
				},
				tags: ['Orders'],
			},
		},
		ordersController.deleteOrder,
	);
}
