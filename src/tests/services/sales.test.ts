import { beforeEach, describe, expect, it, vi } from 'vitest';
import { stripe } from '@/lib/stripe.js';
import { salesRepository } from '@/repositories/sales.js';
import { salesService } from '@/services/sales.js';

vi.mock('@/repositories/sales.js', () => ({
	salesRepository: {
		getOrderStats: vi.fn(),
	},
}));

vi.mock('@/lib/stripe.js', () => ({
	stripe: {
		balance: {
			retrieve: vi.fn(),
		},
	},
}));

const mockOrders = [
	{
		id: 'o1',
		status: 'paid',
		totalPrice: 200,
		quantity: 2,
		productId: 'p1',
		createdAt: '2025-03-15T10:00:00Z',
	},
	{
		id: 'o2',
		status: 'paid',
		totalPrice: 100,
		quantity: 1,
		productId: 'p2',
		createdAt: '2025-03-20T10:00:00Z',
	},
	{
		id: 'o3',
		status: 'pending',
		totalPrice: 50,
		quantity: 1,
		productId: 'p3',
		createdAt: '2025-04-01T10:00:00Z',
	},
];

const mockStripeBalance = {
	available: [{ currency: 'brl', amount: 30000 }],
	pending: [{ currency: 'brl', amount: 5000 }],
};

describe('SalesService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getSalesStats', () => {
		it('should return complete sales stats', async () => {
			vi.mocked(salesRepository.getOrderStats).mockResolvedValue({
				data: mockOrders,
				error: null,
			} as never);
			vi.mocked(stripe.balance.retrieve).mockResolvedValue(
				mockStripeBalance as never,
			);

			const result = await salesService.getSalesStats();

			expect(result.data).toEqual({
				totalOrders: 3,
				paidOrders: 2,
				pendingOrders: 1,
				totalRevenue: 300,
				pendingRevenue: 50,
				totalItemsSold: 3,
				averageOrderValue: 150,
				monthlyRevenue: [{ month: '2025-03', revenue: 300, orders: 2 }],
				recentOrders: mockOrders.map((o) => ({
					id: o.id,
					status: o.status,
					totalPrice: o.totalPrice,
					quantity: o.quantity,
					productId: o.productId,
					createdAt: o.createdAt,
				})),
				stripeBalance: { available: 300, pending: 50 },
			});
		});

		it('should return error when repository fails', async () => {
			vi.mocked(salesRepository.getOrderStats).mockResolvedValue({
				data: null,
				error: { message: 'DB error' },
			} as never);

			const result = await salesService.getSalesStats();

			expect(result).toEqual({ error: 'DB error' });
		});

		it('should return fallback error message when error has no message', async () => {
			vi.mocked(salesRepository.getOrderStats).mockResolvedValue({
				data: null,
				error: null,
			} as never);

			const result = await salesService.getSalesStats();

			expect(result).toEqual({
				error: 'Falha ao buscar estatísticas',
			});
		});

		it('should return zero stripe balance when retrieve fails', async () => {
			vi.mocked(salesRepository.getOrderStats).mockResolvedValue({
				data: mockOrders,
				error: null,
			} as never);
			vi.mocked(stripe.balance.retrieve).mockRejectedValue(
				new Error('Stripe down'),
			);

			const result = await salesService.getSalesStats();

			expect(result.data?.stripeBalance).toEqual({
				available: 0,
				pending: 0,
			});
		});

		it('should return zero average when there are no paid orders', async () => {
			vi.mocked(salesRepository.getOrderStats).mockResolvedValue({
				data: [mockOrders[2]],
				error: null,
			} as never);
			vi.mocked(stripe.balance.retrieve).mockResolvedValue(
				mockStripeBalance as never,
			);

			const result = await salesService.getSalesStats();

			expect(result.data?.paidOrders).toBe(0);
			expect(result.data?.averageOrderValue).toBe(0);
			expect(result.data?.totalItemsSold).toBe(0);
			expect(result.data?.monthlyRevenue).toEqual([]);
		});
	});
});
