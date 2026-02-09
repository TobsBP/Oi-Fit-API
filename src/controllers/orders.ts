import type { FastifyReply, FastifyRequest } from 'fastify';
import { ordersService } from '@/services/orders.js';
import type {
	CreatePaymentRequest,
	OrderCreate,
	OrderUpdate,
} from '@/types/orders.js';

class OrdersController {
	async getAllOrders(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await ordersService.getAllOrders();

		console.log(data);

		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async createOrder(request: FastifyRequest, reply: FastifyReply) {
		const orderData = request.body as OrderCreate;

		const { data, error } = await ordersService.createOrder(orderData);

		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async createPayment(request: FastifyRequest, reply: FastifyReply) {
		const { items, cityName } = request.body as CreatePaymentRequest;
		const userId = request.userId;

		if (!userId) {
			return reply.status(401).send({ message: 'Usuário não autenticado' });
		}

		const result = await ordersService.createPayment(items, cityName, userId);

		if (result.error) {
			return reply.status(400).send({ message: result.error });
		}

		return reply.status(200).send(result.data);
	}

	async updateOrder(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const orderData = request.body as OrderUpdate;

		const { data, error } = await ordersService.updateOrder(id, orderData);

		if (error) {
			return reply.status(400).send({ error });
		}

		return reply.status(200).send(data);
	}

	async deleteOrder(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };

		const { error } = await ordersService.deleteOrder(id);

		if (error) {
			return reply.status(400).send({ error });
		}

		return reply.status(204).send();
	}
}

export const ordersController = new OrdersController();
