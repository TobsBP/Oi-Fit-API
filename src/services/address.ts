import { addressRepository } from '@/repositories/address.js';
import type { AddressCreate, AddressUpdate } from '@/types/address.js';

class AddressService {
	async getAllAddress() {
		return await addressRepository.getAllAdress();
	}

	async getAddressByUserId(email: string) {
		return await addressRepository.getAddressByUserId(email);
	}

	async createAddress(address: AddressCreate) {
		return await addressRepository.creatAddress(address);
	}

	async updateAddress(id: string, address: AddressUpdate) {
		return await addressRepository.updateAddress(id, address);
	}

	async deleteAddress(id: string) {
		return await addressRepository.deleteAddres(id);
	}
}

export const addressService = new AddressService();
