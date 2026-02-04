import { supabase } from '@/lib/supabase.js';
import type { ProductCreate, ProductUpdate } from '@/types/products.js';

class ProductsRepository {
	async getAllProducts() {
		return await supabase.from('Product').select('*');
	}

	async getProductById(id: string) {
		return await supabase.from('Product').select('*').eq('id', id).single();
	}

	async createProduct(product: ProductCreate) {
		return await supabase.from('Product').insert(product).select().single();
	}

	async updateProduct(id: string, product: ProductUpdate) {
		return await supabase
			.from('Product')
			.update(product)
			.eq('id', id)
			.select()
			.single();
	}

	async deleteProduct(id: string) {
		return await supabase
			.from('Product')
			.delete()
			.eq('id', id)
			.select()
			.single();
	}
}

export const productsRepository = new ProductsRepository();
