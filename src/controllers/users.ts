import type { FastifyRequest, FastifyReply } from "fastify";
import { usersService } from "@/services/users";

export class UsersController { 
  async getAllUsers(_request: FastifyRequest, reply: FastifyReply) {
    const { data, error } = await usersService.getAllUsers();
    if (error) {
      reply.status(500).send({ error });
    } else {
      reply.status(200).send({ data });
    }
  }

  async getUserByEmail(request: FastifyRequest<{ Params: { email: string } }>, reply: FastifyReply) {
    const { email } = request.params;
    const { data, error } = await usersService.getUserByEmail(email);
    if (error) {
      reply.status(500).send({ error });
    } else {
      reply.status(200).send({ data });
    }
  }
}

