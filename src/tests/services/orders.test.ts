import { beforeEach, describe, expect, it, vi } from 'vitest';
import { stripe } from '@/lib/stripe.js';
import { supabase } from '@/lib/supabase.js';
import { ordersRepository } from '@/repositories/orders.js';
import { ordersService } from '@/services/orders.js';

vi.mock('@/repositories/orders.js', () => ({
	ordersRepository: {
		getAllOrders: vi.fn(),
		getOrdersByUser: vi.fn(),
		createOrder: vi.fn(),
		createOrders: vi.fn(),
		updateOrder: vi.fn(),
		deleteOrder: vi.fn(),
	},
}));

vi.mock('@/lib/stripe.js', () => ({
	stripe: {
		paymentIntents: {
			create: vi.fn(),
		},
	},
}));

vi.mock('@/lib/supabase.js', () => ({
	supabase: {
		from: vi.fn(),
	},
}));

const mockOrder = {
	id: 'order-1',
	userId: 'user-1',
	status: 'pending',
	totalPrice: 100,
	shippingAddress: { cityName: 'São Paulo' },
	createdAt: '2025-01-01T00:00:00Z',
	updatedAt: '2025-01-01T00:00:00Z',
	quantity: 2,
	productId: 'prod-1',
	paymentIntentId: 'pi_123',
	delivery: null,
};

describe('OrdersService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getAllOrders', () => {
		it('should return all orders', async () => {
			const expected = { data: [mockOrder], error: null };
			vi.mocked(ordersRepository.getAllOrders).mockResolvedValue(
				expected as never,
			);

			const result = await ordersService.getAllOrders();

			expect(ordersRepository.getAllOrders).toHaveBeenCalledOnce();
			expect(result).toEqual(expected);
		});
	});

	describe('getOrdersByUser', () => {
		it('should return orders for a user', async () => {
			const expected = { data: [mockOrder], error: null };
			vi.mocked(ordersRepository.getOrdersByUser).mockResolvedValue(
				expected as never,
			);

			const result = await ordersService.getOrdersByUser('user-1');

			expect(ordersRepository.getOrdersByUser).toHaveBeenCalledWith('user-1');
			expect(result).toEqual(expected);
		});
	});

	describe('createOrder', () => {
		it('should create a single order', async () => {
			const { id, createdAt, updatedAt, ...input } = mockOrder;
			const expected = { data: mockOrder, error: null };
			vi.mocked(ordersRepository.createOrder).mockResolvedValue(
				expected as never,
			);

			const result = await ordersService.createOrder(input);

			expect(ordersRepository.createOrder).toHaveBeenCalledWith(input);
			expect(result).toEqual(expected);
		});
	});

	describe('updateOrder', () => {
		it('should update an order by id', async () => {
			const update = { status: 'paid' };
			const expected = { data: { ...mockOrder, ...update }, error: null };
			vi.mocked(ordersRepository.updateOrder).mockResolvedValue(
				expected as never,
			);

			const result = await ordersService.updateOrder('order-1', update);

			expect(ordersRepository.updateOrder).toHaveBeenCalledWith(
				'order-1',
				update,
			);
			expect(result).toEqual(expected);
		});
	});

	describe('deleteOrder', () => {
		it('should delete an order by id', async () => {
			const expected = { data: null, error: null };
			vi.mocked(ordersRepository.deleteOrder).mockResolvedValue(
				expected as never,
			);

			const result = await ordersService.deleteOrder('order-1');

			expect(ordersRepository.deleteOrder).toHaveBeenCalledWith('order-1');
			expect(result).toEqual(expected);
		});
	});

	describe('createPayment', () => {
		const cartItems = [
			{ productId: 'prod-1', quantity: 2 },
			{ productId: 'prod-2', quantity: 1 },
		];

		const mockProducts = [
			{ id: 'prod-1', price: 100, discount: 10, stock: 10 },
			{ id: 'prod-2', price: 50, discount: 0, stock: 5 },
		];

		function mockSupabaseSelect(data: unknown, error: unknown = null) {
			const chain = {
				select: vi.fn().mockReturnValue({
					in: vi.fn().mockResolvedValue({ data, error }),
				}),
			};
			vi.mocked(supabase.from).mockReturnValue(chain as never);
		}

		it('should create payment and orders successfully', async () => {
			mockSupabaseSelect(mockProducts);
			vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
				id: 'pi_new',
				client_secret: 'secret_123',
			} as never);
			vi.mocked(ordersRepository.createOrders).mockResolvedValue({
				error: null,
			} as never);

			const result = await ordersService.createPayment(
				cartItems,
				'São Paulo',
				'user-1',
			);

			expect(supabase.from).toHaveBeenCalledWith('Product');
			expect(stripe.paymentIntents.create).toHaveBeenCalledWith({
				amount: Math.round((90 * 2 + 50) * 100),
				currency: 'brl',
				metadata: { userId: 'user-1', cityName: 'São Paulo' },
			});
			expect(ordersRepository.createOrders).toHaveBeenCalledWith(
				expect.arrayContaining([
					expect.objectContaining({
						productId: 'prod-1',
						paymentIntentId: 'pi_new',
					}),
					expect.objectContaining({
						productId: 'prod-2',
						paymentIntentId: 'pi_new',
					}),
				]),
			);
			expect(result).toEqual({ data: { clientSecret: 'secret_123' } });
		});

		it('should return error when products fetch fails', async () => {
			mockSupabaseSelect(null, { message: 'DB error' });

			const result = await ordersService.createPayment(
				cartItems,
				'São Paulo',
				'user-1',
			);

			expect(result).toEqual({ error: 'DB error' });
		});

		it('should return error when product is not found', async () => {
			mockSupabaseSelect([mockProducts[0]]);

			const result = await ordersService.createPayment(
				cartItems,
				'São Paulo',
				'user-1',
			);

			expect(result).toEqual({ error: 'Produto prod-2 não encontrado' });
		});

		it('should return error when stock is insufficient', async () => {
			mockSupabaseSelect([{ ...mockProducts[0], stock: 1 }, mockProducts[1]]);

			const result = await ordersService.createPayment(
				cartItems,
				'São Paulo',
				'user-1',
			);

			expect(result).toEqual({
				error: 'Estoque insuficiente para o produto prod-1. Disponível: 1',
			});
		});

		it('should return error when stripe payment fails', async () => {
			mockSupabaseSelect(mockProducts);
			vi.mocked(stripe.paymentIntents.create).mockRejectedValue(
				new Error('Stripe error'),
			);

			const result = await ordersService.createPayment(
				cartItems,
				'São Paulo',
				'user-1',
			);

			expect(result).toEqual({ error: 'Stripe error' });
		});

		it('should return error when order creation fails', async () => {
			mockSupabaseSelect(mockProducts);
			vi.mocked(stripe.paymentIntents.create).mockResolvedValue({
				id: 'pi_new',
				client_secret: 'secret_123',
			} as never);
			vi.mocked(ordersRepository.createOrders).mockResolvedValue({
				error: 'Insert failed',
			} as never);

			const result = await ordersService.createPayment(
				cartItems,
				'São Paulo',
				'user-1',
			);

			expect(result).toEqual({ error: 'Insert failed' });
		});
	});
});
