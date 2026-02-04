import type { FastifyReply, FastifyRequest } from 'fastify';
import { usersService } from '@/services/users.js';
import type { UserUpdate } from '@/types/users.js';

export class UsersController {
	async getAllUsers(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await usersService.getAllUsers();

		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async getUserById(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { data, error } = await usersService.getUserById(id);
		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async updateUser(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const userData = request.body as UserUpdate;
		const { data, error } = await usersService.updateUser(id, userData);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async deleteUser(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { error } = await usersService.deleteUser(id);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(204).send();
		}
	}
}

export const usersController = new UsersController();
