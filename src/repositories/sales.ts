import { supabase } from '@/lib/supabase.js';

class SalesRepository {
	async getOrderStats() {
		return await supabase
			.from('Order')
			.select('id, status, totalPrice, quantity, productId, createdAt')
			.order('createdAt', { ascending: false });
	}
}

export const salesRepository = new SalesRepository();
