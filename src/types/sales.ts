import { z } from 'zod';
import { orderSchema } from './orders.js';

export const salesStatsSchema = z.object({
	totalOrders: z.number(),
	paidOrders: z.number(),
	pendingOrders: z.number(),
	totalRevenue: z.number(),
	pendingRevenue: z.number(),
	totalItemsSold: z.number(),
	averageOrderValue: z.number(),
	monthlyRevenue: z.array(
		z.object({
			month: z.string(),
			revenue: z.number(),
			orders: z.number(),
		}),
	),
	recentOrders: z.array(
		orderSchema.pick({
			id: true,
			status: true,
			totalPrice: true,
			quantity: true,
			productId: true,
			createdAt: true,
		}),
	),
	stripeBalance: z.object({
		available: z.number(),
		pending: z.number(),
	}),
});

export type SalesStats = z.infer<typeof salesStatsSchema>;
