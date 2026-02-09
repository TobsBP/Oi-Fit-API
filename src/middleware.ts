import type { FastifyReply, FastifyRequest } from 'fastify';
import { supabase } from '@/lib/supabase.js';

declare module 'fastify' {
	interface FastifyRequest {
		userId?: string;
	}
}

export const authenticate = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const authHeader = request.headers.authorization;

	if (!authHeader) {
		return reply.status(401).send({
			statusCode: 401,
			error: 'Unauthorized',
			message: 'Not authenticated',
		});
	}

	const [scheme, token] = authHeader.split(' ');

	if (scheme !== 'Bearer' || !token) {
		return reply.status(401).send({
			statusCode: 401,
			error: 'Unauthorized',
			message: 'Not authenticated',
		});
	}

	const { data, error } = await supabase.auth.getUser(token);

	if (error || !data.user) {
		return reply.status(401).send({
			statusCode: 401,
			error: 'Unauthorized',
			message: 'Invalid or expired token',
		});
	}

	request.userId = data.user.id;
};
