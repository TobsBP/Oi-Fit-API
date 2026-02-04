import { supabase } from '@/lib/supabase.js';
import type { UserUpdate } from '@/types/users.js';

class UsersRepository {
	async getAllUsers() {
		return await supabase.from('User').select('*');
	}

	async findUserById(id: string) {
		return await supabase.from('User').select('*').eq('id', id).single();
	}

	async updateUser(id: string, userData: UserUpdate) {
		return await supabase
			.from('User')
			.update(userData)
			.eq('id', id)
			.select()
			.single();
	}

	async deleteUser(id: string) {
		return await supabase.from('User').delete().eq('id', id).select().single();
	}
}

export const usersRepository = new UsersRepository();
