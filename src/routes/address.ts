import type { FastifyInstance } from 'fastify';
import z from 'zod';
import { addressController } from '@/controllers/address.js';
import { authenticate } from '@/middleware.js';
import { addressSchema } from '@/types/address.js';
import { ErrorSchema } from '@/types/error.js';

export async function addressRoute(server: FastifyInstance) {
	server.get(
		'/addresses',
		{
			preHandler: [authenticate],
			schema: {
				description: 'Get all addresses',
				response: {
					200: z.array(addressSchema),
					500: ErrorSchema,
				},
				tags: ['Address'],
			},
		},
		addressController.getAllAddress,
	);

	server.get(
		'/address/:userId',
		{
			schema: {
				description: 'Get a product by userId',
				response: {
					200: z.array(addressSchema),
					404: ErrorSchema,
				},
				tags: ['Address'],
			},
		},
		addressController.getAddressByUserId,
	);

	server.post(
		'/address',
		{
			schema: {
				description: 'Create a product',
				body: addressSchema.omit({ id: true }),
				response: {
					201: addressSchema,
					400: ErrorSchema,
				},
				tags: ['Address'],
			},
		},
		addressController.createAddress,
	);

	server.put(
		'/address/:id',
		{
			schema: {
				description: 'Update an address',
				body: addressSchema.omit({ id: true }).partial(),
				response: {
					200: addressSchema,
					400: ErrorSchema,
					404: ErrorSchema,
				},
				tags: ['Address'],
			},
		},
		addressController.updateAddress,
	);

	server.patch(
		'/address/:id',
		{
			schema: {
				description: 'Partially update an address',
				body: addressSchema.omit({ id: true }).partial(),
				response: {
					200: addressSchema,
					400: ErrorSchema,
					404: ErrorSchema,
				},
				tags: ['Address'],
			},
		},
		addressController.updateAddress,
	);

	server.delete(
		'/address/:id',
		{
			schema: {
				description: 'Delete a address',
				response: {
					204: z.object({}),
					404: ErrorSchema,
				},
				tags: ['Address'],
			},
		},
		addressController.deleteAddress,
	);
}
