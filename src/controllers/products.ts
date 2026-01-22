import type { FastifyReply, FastifyRequest } from 'fastify';
import { productsService } from '@/services/products';

class ProductsController {
	async getAllProducts(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await productsService.getAllProducts();

		console.log('data', data);

		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async getProductById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await productsService.getProductById(id);

		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}
}

export const productsController = new ProductsController();
