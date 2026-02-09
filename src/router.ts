import type { FastifyInstance } from 'fastify';
import { addressRoute } from './routes/address.js';
import { authRoute } from './routes/auth.js';
import { productsRoute } from './routes/products.js';
import { usersRoute } from './routes/users.js';
import { ordersRoute } from './routes/orders.js';

export const routes = async (app: FastifyInstance) => {
	app.register(authRoute);
	app.register(usersRoute);
	app.register(productsRoute);
	app.register(addressRoute);
	app.register(ordersRoute);
};
