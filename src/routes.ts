import type { FastifyInstance } from 'fastify';
import { authRoute } from './routes/auth';
import { usersRoute } from './routes/users';
import { productsRoute } from './routes/products';

export const routes = async (app: FastifyInstance) => {
	app.register(authRoute);
  app.register(usersRoute);
	app.register(productsRoute);
};
