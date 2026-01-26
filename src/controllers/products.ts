import type { FastifyReply, FastifyRequest } from 'fastify';
import { productsService } from '@/services/products';
import type { ProductCreate, ProductUpdate } from '@/types/products';

class ProductsController {
	async getAllProducts(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await productsService.getAllProducts();

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

	async createProduct(request: FastifyRequest, reply: FastifyReply) {
		const productData = request.body as ProductCreate;

		const { data, error } = await productsService.createProduct(productData);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(201).send(data);
		}
	}

	async updateProduct(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const productData = request.body as ProductUpdate;

		const { data, error } = await productsService.updateProduct(
			id,
			productData,
		);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async deleteProduct(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { error } = await productsService.deleteProduct(id);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(204).send();
		}
	}
}

export const productsController = new ProductsController();
