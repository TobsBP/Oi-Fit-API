import type { FastifyReply, FastifyRequest } from 'fastify';
import { addressService } from '@/services/address.js';
import type { Address, AddressUpdate } from '@/types/address.js';

class AddressController {
	async getAllAddress(_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await addressService.getAllAddress();

		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async getAddressByUserId(request: FastifyRequest, reply: FastifyReply) {
		const { userId } = request.params as { userId: string };
		const { data, error } = await addressService.getAddressByUserId(userId);

		if (error) {
			reply.status(500).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async createAddress(request: FastifyRequest, reply: FastifyReply) {
		const addressData = request.body as Address;

		const { data, error } = await addressService.createAddress(addressData);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(201).send(data);
		}
	}

	async updateAddress(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const addressData = request.body as AddressUpdate;

		const { data, error } = await addressService.updateAddress(id, addressData);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(200).send(data);
		}
	}

	async deleteAddress(request: FastifyRequest, reply: FastifyReply) {
		const { id } = request.params as { id: string };
		const { error } = await addressService.deleteAddress(id);

		if (error) {
			reply.status(400).send({ error });
		} else {
			reply.status(204).send();
		}
	}
}

export const addressController = new AddressController();
