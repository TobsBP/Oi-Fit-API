import { supabase } from '@/lib/supabase.js';
import type { AddressCreate, AddressUpdate } from '@/types/address.js';

class AddressRepository {
	async getAllAddress() {
		return await supabase.from('Address').select('*');
	}

	async getAddressByUserId(userId: string) {
		return await supabase
			.from('Address')
			.select('*')
			.eq('userId', userId)
			.single();
	}

	async createAddress(address: AddressCreate) {
		return await supabase.from('Address').insert(address).select().single();
	}

	async updateAddress(id: string, address: AddressUpdate) {
		return await supabase
			.from('Address')
			.update(address)
			.eq('id', id)
			.select()
			.single();
	}

	async deleteAddress(id: string) {
		return await supabase
			.from('Address')
			.delete()
			.eq('id', id)
			.select()
			.single();
	}
}

export const addressRepository = new AddressRepository();
