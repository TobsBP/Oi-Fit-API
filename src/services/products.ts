import { productsRepository } from '@/repositories/products';

class ProductsService {
	async getAllProducts() {
		return await productsRepository.getAllProducts();
	}

	async getProductById(id: string) {
		return await productsRepository.getProductById(id);
	}
}

export const productsService = new ProductsService();
