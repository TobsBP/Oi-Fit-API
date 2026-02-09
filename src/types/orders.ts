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
});

export type Order = z.infer<typeof orderSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;
export type CreatePaymentRequest = z.infer<typeof createPaymentSchema>;

export type OrderCreate = Omit<Order, 'id' | 'createdAt' | 'updatedAt'>;
export type OrderUpdate = Partial<OrderCreate>;
