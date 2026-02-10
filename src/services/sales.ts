import { stripe } from '@/lib/stripe.js';
import { salesRepository } from '@/repositories/sales.js';
import type { SalesStats } from '@/types/sales.js';

class SalesService {
	async getSalesStats(): Promise<{ data?: SalesStats; error?: string }> {
		const { data: orders, error } = await salesRepository.getOrderStats();

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

		const monthlyMap = new Map<string, { revenue: number; orders: number }>();
		for (const order of paidOrders) {
			const date = new Date(order.createdAt);
			const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
			const entry = monthlyMap.get(month) ?? { revenue: 0, orders: 0 };
			entry.revenue += order.totalPrice;
			entry.orders += 1;
			monthlyMap.set(month, entry);
		}
		const monthlyRevenue = Array.from(monthlyMap.entries())
			.sort((a, b) => b[0].localeCompare(a[0]))
			.map(([month, data]) => ({ month, ...data }));

		const recentOrders = orders.slice(0, 10).map((o) => ({
			id: o.id,
			status: o.status,
			totalPrice: o.totalPrice,
			quantity: o.quantity,
			productId: o.productId,
			createdAt: o.createdAt,
		}));

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
				monthlyRevenue,
				recentOrders,
				stripeBalance,
			},
		};
	}
}

export const salesService = new SalesService();
