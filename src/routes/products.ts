import type { FastifyInstance } from 'fastify';
import z from 'zod';
import { productsController } from '@/controllers/products';
import { ErrorSchema } from '@/types/error';
import { productSchema } from '@/types/products';

export async function productsRoute(server: FastifyInstance) {
	server.get(
		'/products',
		{
			schema: {
				description: 'Get all products',
				response: {
					200: z.array(productSchema),
					500: ErrorSchema,
				},
				tags: ['Products'],
			},
		},
		productsController.getAllProducts,
	);

	server.get(
		'/products/:id',
		{
			schema: {
				description: 'Get a product by id',
				response: {
					200: productSchema,
					404: ErrorSchema,
				},
				tags: ['Products'],
			},
		},
		productsController.getProductById,
	);

	server.post(
		'/product',
		{
			schema: {
				description: 'Create a product',
				body: productSchema.omit({ id: true }),
				response: {
					201: productSchema,
					400: ErrorSchema,
				},
				tags: ['Products'],
			},
		},
		productsController.createProduct,
	);

	server.put(
		'/products/:id',
		{
			schema: {
				description: 'Update a product',
				body: productSchema.partial(),
				response: {
					200: productSchema,
					400: ErrorSchema,
					404: ErrorSchema,
				},
				tags: ['Products'],
			},
		},
		productsController.updateProduct,
	);

	server.delete(
		'/products/:id',
		{
			schema: {
				description: 'Delete a product',
				response: {
					204: z.object({}),
					404: ErrorSchema,
				},
				tags: ['Products'],
			},
		},
		productsController.deleteProduct,
	);
}
