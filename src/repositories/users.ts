import { supabase } from '@/lib/supabase';

export class UsersRepository {
	async findUserByEmail(email: string) {
		return await supabase.from('users').select('*').eq('email', email).single();
	}

	async getAllUsers() {
		return await supabase.from('users').select('*');
	}
}

export const usersRepository = new UsersRepository();
