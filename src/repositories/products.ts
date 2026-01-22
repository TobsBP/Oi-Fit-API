import { supabase } from '@/lib/supabase';

export class ProductsRepository {
	async getAllProducts() {
		return await supabase.from('Product').select('*');
	}

	async getProductById(id: string) {
		return await supabase.from('Product').select('*').eq('id', id).single();
	}
}
