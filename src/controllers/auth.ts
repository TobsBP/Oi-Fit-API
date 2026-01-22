import type { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from '@/services/auth';
import type { Login, Register } from '@/types/auth';

export class AuthController {
	async register(request: FastifyRequest, reply: FastifyReply) {
		try {
			const result = await authService.signUp(request.body as Register);
			return reply.status(201).send(result);
		} catch (err) {
			return reply.status(400).send({ message: err });
		}
	}

	async login(request: FastifyRequest, reply: FastifyReply) {
		try {
			const result = await authService.signIn(request.body as Login);
			return reply.send(result);
		} catch (err) {
			return reply.status(401).send({ message: err });
		}
	}
}

export const authController = new AuthController();
