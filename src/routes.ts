import type { FastifyInstance } from 'fastify';
import { addressRoute } from './routes/address';
import { authRoute } from './routes/auth';
import { productsRoute } from './routes/products';
import { usersRoute } from './routes/users';

export const routes = async (app: FastifyInstance) => {
	app.register(authRoute);
	app.register(usersRoute);
	app.register(productsRoute);
	app.register(addressRoute);
};
