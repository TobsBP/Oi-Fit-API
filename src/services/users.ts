import { usersRepository } from "@/repositories/users";

export class UsersService {
  async getAllUsers() {
    return await usersRepository.getAllUsers();
  }
  
  async getUserById(id: string) {
    return await usersRepository.findUserById(id);
  }
}

export const usersService = new UsersService();
