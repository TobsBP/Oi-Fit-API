import type { FastifyInstance } from 'fastify';
import { addressRoute } from './routes/address.js';
import { authRoute } from './routes/auth.js';
import { ordersRoute } from './routes/orders.js';
import { productsRoute } from './routes/products.js';
import { usersRoute } from './routes/users.js';
import { webhookRoute } from './routes/webhook.js';

export const routes = async (app: FastifyInstance) => {
	app.register(authRoute);
	app.register(usersRoute);
	app.register(productsRoute);
	app.register(addressRoute);
	app.register(ordersRoute);
	app.register(webhookRoute);
};
