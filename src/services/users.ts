import { usersRepository } from "@/repositories/users";

export class UsersService {
  async getAllUsers() {
    return await usersRepository.getAllUsers();
  }
  
  async getUserByEmail(email: string) {
    return await usersRepository.findUserByEmail(email);
  }
}

export const usersService = new UsersService();
