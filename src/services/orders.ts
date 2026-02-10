import { stripe } from '@/lib/stripe.js';
import { supabase } from '@/lib/supabase.js';
import { ordersRepository } from '@/repositories/orders.js';
import type {
	CartItem,
	OrderCreate,
	OrderUpdate,
	SalesStats,
} from '@/types/orders.js';

class OrdersService {
	async getAllOrders() {
		return await ordersRepository.getAllOrders();
	}

	async getOrdersByUser(userId: string) {
		return await ordersRepository.getOrdersByUser(userId);
	}

	async createOrder(order: OrderCreate) {
		return await ordersRepository.createOrder(order);
	}

	async updateOrder(id: string, order: OrderUpdate) {
		return await ordersRepository.updateOrder(id, order);
	}

	async deleteOrder(id: string) {
		return await ordersRepository.deleteOrder(id);
	}

	async getSalesStats(): Promise<{ data?: SalesStats; error?: string }> {
		const { data: orders, error } = await ordersRepository.getOrderStats();

		if (error || !orders) {
			return { error: error?.message || 'Falha ao buscar estatísticas' };
		}

		const paidOrders = orders.filter((o) => o.status === 'paid');
		const pendingOrders = orders.filter((o) => o.status === 'pending');

		const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0);
		const pendingRevenue = pendingOrders.reduce(
			(sum, o) => sum + o.totalPrice,
			0,
		);
		const totalItemsSold = paidOrders.reduce((sum, o) => sum + o.quantity, 0);

		let stripeBalance = { available: 0, pending: 0 };
		try {
			const balance = await stripe.balance.retrieve();
			const availableBrl = balance.available.find((b) => b.currency === 'brl');
			const pendingBrl = balance.pending.find((b) => b.currency === 'brl');
			stripeBalance = {
				available: (availableBrl?.amount ?? 0) / 100,
				pending: (pendingBrl?.amount ?? 0) / 100,
			};
		} catch {
			// Stripe balance fetch failed, return zeros
		}

		return {
			data: {
				totalOrders: orders.length,
				paidOrders: paidOrders.length,
				pendingOrders: pendingOrders.length,
				totalRevenue,
				pendingRevenue,
				totalItemsSold,
				averageOrderValue:
					paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
				stripeBalance,
			},
		};
	}

	async createPayment(items: CartItem[], cityName: string, userId: string) {
		const productIds = items.map((item) => item.productId);
		const { data: products, error: productsError } = await supabase
			.from('Product')
			.select('id, price, discount')
			.in('id', productIds);

		if (productsError || !products) {
			return { error: productsError?.message || 'Falha ao buscar produtos' };
		}

		const productMap = new Map(products.map((p) => [p.id, p]));

		let totalAmount = 0;
		const orders: OrderCreate[] = [];

		for (const item of items) {
			const product = productMap.get(item.productId);
			if (!product) {
				return { error: `Produto ${item.productId} não encontrado` };
			}

			const price =
				product.discount > 0
					? product.price - (product.price * product.discount) / 100
					: product.price;
			const itemTotal = price * item.quantity;
			totalAmount += itemTotal;

			orders.push({
				userId,
				status: 'pending',
				totalPrice: itemTotal,
				shippingAddress: { cityName },
				quantity: item.quantity,
				productId: item.productId,
				paymentIntentId: null,
			});
		}

		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount: Math.round(totalAmount * 100),
				currency: 'brl',
				metadata: { userId, cityName },
			});

			const ordersWithPayment = orders.map((order) => ({
				...order,
				paymentIntentId: paymentIntent.id,
			}));

			const { error: orderError } =
				await ordersRepository.createOrders(ordersWithPayment);

			if (orderError) {
				return { error: orderError };
			}

			return { data: { clientSecret: paymentIntent.client_secret } };
		} catch (err) {
			return {
				error: err instanceof Error ? err.message : 'Erro ao criar pagamento',
			};
		}
	}
}

export const ordersService = new OrdersService();
