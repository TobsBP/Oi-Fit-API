import type { FastifyInstance } from 'fastify';
import z from 'zod';
import { productsController } from '@/controllers/products';
import { productSchema } from '@/types/products';

export async function productsRoute(server: FastifyInstance) {
	server.get(
		'/products',
		{
			schema: {
				description: 'Get all products',
				response: {
					200: z.array(productSchema),
				},
				tags: ['Products'],
			},
		},
		productsController.getAllProducts,
	);
}
