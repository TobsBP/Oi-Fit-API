import { supabase } from '@/lib/supabase';

class UsersRepository {
	async getAllUsers() {
		return await supabase.from('User').select('*');
	}

	async findUserById(id: string) {
		return await supabase.from('User').select('*').eq('id', id).single();
	}
}

export const usersRepository = new UsersRepository();
