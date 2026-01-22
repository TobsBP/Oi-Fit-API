import type { FastifyInstance } from 'fastify';
import { authRoute } from './routes/auth';

export const routes = async (app: FastifyInstance) => {
	app.register(authRoute);
};
