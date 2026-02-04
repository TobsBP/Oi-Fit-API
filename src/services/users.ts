import { usersRepository } from '@/repositories/users.js';
import type { UserUpdate } from '@/types/users.js';

export class UsersService {
	async getAllUsers() {
		return await usersRepository.getAllUsers();
	}

	async getUserById(id: string) {
		return await usersRepository.findUserById(id);
	}

	async updateUser(id: string, userData: UserUpdate) {
		return await usersRepository.updateUser(id, userData);
	}

	async deleteUser(id: string) {
		return await usersRepository.deleteUser(id);
	}
}

export const usersService = new UsersService();
