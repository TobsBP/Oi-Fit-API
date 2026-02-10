import { z } from 'zod';

export const cartItemSchema = z.object({
	productId: z.string(),
	quantity: z.number().int().min(1),
});

export const createPaymentSchema = z.object({
	items: z.array(cartItemSchema).min(1),
	cityName: z.string(),
});

export const orderSchema = z.object({
	id: z.string(),
	userId: z.string(),
	status: z.string(),
	totalPrice: z.number(),
	shippingAddress: z.json(),
	createdAt: z.string(),
	updatedAt: z.string(),
	quantity: z.number(),
	productId: z.string(),
	paymentIntentId: z.string().nullable(),
});

export type Order = z.infer<typeof orderSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CreatePaymentRequest = z.infer<typeof createPaymentSchema>;

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
export type OrderCreate = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type OrderUpdate = Partial<OrderCreate>;
