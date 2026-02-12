import { beforeEach, describe, expect, it, vi } from 'vitest';
import { productsRepository } from '@/repositories/products.js';
import { productsService } from '@/services/products.js';

vi.mock('@/repositories/products.js', () => ({
	productsRepository: {
		getAllProducts: vi.fn(),
		getProductById: vi.fn(),
		createProduct: vi.fn(),
		updateProduct: vi.fn(),
		deleteProduct: vi.fn(),
	},
}));

const mockProduct = {
	id: 'prod-1',
	name: 'Whey Protein',
	description: 'Whey isolado 900g',
	price: 149.9,
	discount: 10,
	category: 'suplementos',
	size: '900g',
	stock: 50,
	images: ['img1.jpg'],
	isActive: true,
	showStock: true,
	createdAt: '2025-01-01T00:00:00Z',
	updatedAt: '2025-01-01T00:00:00Z',
};

describe('ProductsService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getAllProducts', () => {
		it('should return all products', async () => {
			const expected = { data: [mockProduct], error: null };
			vi.mocked(productsRepository.getAllProducts).mockResolvedValue(
				expected as never,
			);

			const result = await productsService.getAllProducts();

			expect(productsRepository.getAllProducts).toHaveBeenCalledOnce();
			expect(result).toEqual(expected);
		});
	});

	describe('getProductById', () => {
		it('should return a product by id', async () => {
			const expected = { data: mockProduct, error: null };
			vi.mocked(productsRepository.getProductById).mockResolvedValue(
				expected as never,
			);

			const result = await productsService.getProductById('prod-1');

			expect(productsRepository.getProductById).toHaveBeenCalledWith('prod-1');
			expect(result).toEqual(expected);
		});
	});

	describe('createProduct', () => {
		it('should create a product', async () => {
			const { id, createdAt, updatedAt, ...input } = mockProduct;
			const expected = { data: mockProduct, error: null };
			vi.mocked(productsRepository.createProduct).mockResolvedValue(
				expected as never,
			);

			const result = await productsService.createProduct(input);

			expect(productsRepository.createProduct).toHaveBeenCalledWith(input);
			expect(result).toEqual(expected);
		});
	});

	describe('updateProduct', () => {
		it('should update a product by id', async () => {
			const update = { price: 129.9 };
			const expected = { data: { ...mockProduct, ...update }, error: null };
			vi.mocked(productsRepository.updateProduct).mockResolvedValue(
				expected as never,
			);

			const result = await productsService.updateProduct('prod-1', update);

			expect(productsRepository.updateProduct).toHaveBeenCalledWith(
				'prod-1',
				update,
			);
			expect(result).toEqual(expected);
		});
	});

	describe('deleteProduct', () => {
		it('should delete a product by id', async () => {
			const expected = { data: mockProduct, error: null };
			vi.mocked(productsRepository.deleteProduct).mockResolvedValue(
				expected as never,
			);

			const result = await productsService.deleteProduct('prod-1');

			expect(productsRepository.deleteProduct).toHaveBeenCalledWith('prod-1');
			expect(result).toEqual(expected);
		});
	});
});
