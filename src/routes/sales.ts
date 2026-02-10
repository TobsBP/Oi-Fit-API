import type { FastifyInstance } from 'fastify';
import { salesController } from '@/controllers/sales.js';
import { authenticate } from '@/middleware.js';
import { ErrorSchema } from '@/types/error.js';
import { salesStatsSchema } from '@/types/sales.js';

export async function salesRoute(server: FastifyInstance) {
	server.get(
		'/sales',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Get sales statistics with Stripe balance',
				response: {
					200: salesStatsSchema,
					500: ErrorSchema,
				},
				tags: ['Sales'],
			},
		},
		salesController.getSalesStats,
	);
}
