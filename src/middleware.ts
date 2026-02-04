import type { FastifyReply, FastifyRequest } from 'fastify';

export const authenticate = async (
	request: FastifyRequest,
	reply: FastifyReply,
) => {
	const authHeader = request.headers.authorization;
	const token = authHeader?.replace('Bearer ', '');

	if (!token) {
		return reply.status(401).send({
			statusCode: 401,
			error: 'Unauthorized',
			message: 'Not authenticated',
		});
	}
};
