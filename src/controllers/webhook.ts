import type { FastifyReply, FastifyRequest } from 'fastify';
import { stripe } from '@/lib/stripe.js';
import { ordersRepository } from '@/repositories/orders.js';
import { productsRepository } from '@/repositories/products.js';

class WebhookController {
	async handleStripeWebhook(request: FastifyRequest, reply: FastifyReply) {
		const signature = request.headers['stripe-signature'];

		if (!signature) {
			return reply.status(400).send({ message: 'Assinatura Stripe ausente' });
		}

		const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

		if (!webhookSecret) {
			return reply
				.status(500)
				.send({ message: 'STRIPE_WEBHOOK_SECRET não configurado' });
		}

		try {
			const event = stripe.webhooks.constructEvent(
				request.body as string,
				signature,
				webhookSecret,
			);

			if (event.type === 'payment_intent.succeeded') {
				const paymentIntent = event.data.object;

				const { data: orders, error } =
					await ordersRepository.updateOrdersByPaymentIntent(
						paymentIntent.id,
						'paid',
					);

				if (error) {
					console.error('Erro ao atualizar pedidos:', error);
					return reply
						.status(500)
						.send({ message: 'Erro ao atualizar pedidos' });
				}

				if (orders) {
					for (const order of orders) {
						const { error: stockError } =
							await productsRepository.decrementStock(
								order.productId,
								order.quantity,
							);

						if (stockError) {
							console.error(
								`Erro ao decrementar estoque do produto ${order.productId}:`,
								stockError,
							);
						}
					}
				}
			}

			return reply.status(200).send({ received: true });
		} catch (err) {
			console.error('Erro no webhook:', err);
			return reply.status(400).send({ message: 'Evento inválido' });
		}
	}
}

export const webhookController = new WebhookController();
