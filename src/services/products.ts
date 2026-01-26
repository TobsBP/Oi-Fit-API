import { productsRepository } from '@/repositories/products';
import type { ProductCreate, ProductUpdate } from '@/types/products';

class ProductsService {
	async getAllProducts() {
		return await productsRepository.getAllProducts();
	}

	async getProductById(id: string) {
		return await productsRepository.getProductById(id);
	}

	async createProduct(product: ProductCreate) {
		return await productsRepository.createProduct(product);
	}

	async updateProduct(id: string, product: ProductUpdate) {
		return await productsRepository.updateProduct(id, product);
	}

	async deleteProduct(id: string) {
		return await productsRepository.deleteProduct(id);
	}
}

export const productsService = new ProductsService();
