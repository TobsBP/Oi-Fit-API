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

	async decrementStock(productId: string, quantity: number) {
		const { data: product, error: fetchError } = await supabase
			.from('Product')
			.select('stock')
			.eq('id', productId)
			.single();

		if (fetchError || !product) {
			return { error: fetchError?.message || 'Produto não encontrado' };
		}

		const newStock = product.stock - quantity;

		const { error: updateError } = await supabase
			.from('Product')
			.update({ stock: newStock })
			.eq('id', productId);

		if (updateError) {
			return { error: updateError.message };
		}

		return { error: null };
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
