import { supabase } from '@/lib/supabase.js';
import type { OrderCreate, OrderUpdate } from '@/types/orders.js';

class OrdersRepository {
	async getAllOrders() {
		return await supabase.from('Order').select('*');
	}

	async getOrdersByUser(userId: string) {
		return await supabase.from('Order').select('*').eq('userId', userId);
	}

	async createOrder(order: OrderCreate) {
		return await supabase.from('Order').insert(order).select().single();
	}

	async createOrders(orders: OrderCreate[]) {
		return await supabase.from('Order').insert(orders).select();
	}

	async updateOrder(id: string, order: OrderUpdate) {
		return await supabase
			.from('Order')
			.update(order)
			.eq('id', id)
			.select()
			.single();
	}

	async updateOrdersByPaymentIntent(paymentIntentId: string, status: string) {
		return await supabase
			.from('Order')
			.update({ status })
			.eq('paymentIntentId', paymentIntentId)
			.select();
	}

	async getOrderStats() {
		return await supabase
			.from('Order')
			.select('id, status, totalPrice, quantity, productId, createdAt')
			.order('createdAt', { ascending: false });
	}

	async deleteOrder(id: string) {
		return await supabase.from('Order').delete().eq('id', id);
	}
}

export const ordersRepository = new OrdersRepository();
