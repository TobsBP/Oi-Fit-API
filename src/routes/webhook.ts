import type { FastifyInstance } from 'fastify';
import { webhookController } from '@/controllers/webhook.js';

export async function webhookRoute(server: FastifyInstance) {
	server.addContentTypeParser(
		'application/json',
		{ parseAs: 'string' },
		(_req, body, done) => {
			done(null, body);
		},
	);

	server.post(
		'/webhook/stripe',
		{
			schema: {
				description: 'Stripe webhook endpoint',
				tags: ['Webhook'],
				hide: true,
			},
		},
		webhookController.handleStripeWebhook,
	);
}
