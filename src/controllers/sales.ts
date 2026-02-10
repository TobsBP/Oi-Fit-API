import type { FastifyReply, FastifyRequest } from 'fastify';
import { salesService } from '@/services/sales.js';

class SalesController {
	async getSalesStats(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await salesService.getSalesStats();

		if (error) {
			return reply.status(500).send({ error });
		}

		return reply.status(200).send(data);
	}
}

export const salesController = new SalesController();
