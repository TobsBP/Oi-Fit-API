import { supabase } from '@/lib/supabase';
import type { ProductCreate, ProductUpdate } from '@/types/products';

class ProductsRepository {
	async getAllProducts() {
		return await supabase.from('Product').select('*, Variant(*)');
	}

	async getProductById(id: string) {
		return await supabase
			.from('Product')
			.select('*, Variant(*)')
			.eq('id', id)
			.single();
	}

	async createProduct(product: ProductCreate) {
		return await supabase.from('Product').insert(product).single();
	}

	async updateProduct(id: string, product: ProductUpdate) {
		return await supabase.from('Product').update(product).eq('id', id).single();
	}

	async deleteProduct(id: string) {
		return await supabase.from('Product').delete().eq('id', id).single();
	}
}

export const productsRepository = new ProductsRepository();
