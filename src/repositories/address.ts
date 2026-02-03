import { supabase } from '@/lib/supabase';
import type { AddressCreate, AddressUpdate } from '@/types/address';

class AddressRepository {
	async getAllAdress() {
		return await supabase.from('Address').select('*');
	}

	async getAddressByUserId(userId: string) {
		return await supabase
			.from('Address')
			.select('*')
			.eq('userId', userId)
			.single();
	}

	async creatAddress(address: AddressCreate) {
		return await supabase.from('Address').insert(address).single();
	}

	async updateAddress(id: string, address: AddressUpdate) {
		return await supabase.from('Address').update(address).eq('id', id).single();
	}

	async deleteAddres(id: string) {
		return await supabase.from('Address').delete().eq('id', id).single();
	}
}

export const addressRepository = new AddressRepository();
