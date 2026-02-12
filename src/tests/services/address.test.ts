import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addressRepository } from '@/repositories/address.js';
import { addressService } from '@/services/address.js';

vi.mock('@/repositories/address.js', () => ({
	addressRepository: {
		getAllAddress: vi.fn(),
		getAddressByUserId: vi.fn(),
		createAddress: vi.fn(),
		updateAddress: vi.fn(),
		deleteAddress: vi.fn(),
	},
}));

const mockAddress = {
	id: '1',
	userId: 'user-123',
	street: 'Rua das Flores',
	number: '100',
	complement: 'Apt 12',
	city: 'São Paulo',
	state: 'SP',
	zipCode: '01000-000',
	country: 'Brasil',
	neighborhood: 'Centro',
};

describe('AddressService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getAllAddress', () => {
		it('should return all addresses', async () => {
			const expected = { data: [mockAddress], error: null };
			vi.mocked(addressRepository.getAllAddress).mockResolvedValue(
				expected as never,
			);

			const result = await addressService.getAllAddress();

			expect(addressRepository.getAllAddress).toHaveBeenCalledOnce();
			expect(result).toEqual(expected);
		});
	});

	describe('getAddressByUserId', () => {
		it('should return addresses for a given user', async () => {
			const expected = { data: [mockAddress], error: null };
			vi.mocked(addressRepository.getAddressByUserId).mockResolvedValue(
				expected as never,
			);

			const result = await addressService.getAddressByUserId('user-123');

			expect(addressRepository.getAddressByUserId).toHaveBeenCalledWith(
				'user-123',
			);
			expect(result).toEqual(expected);
		});
	});

	describe('createAddress', () => {
		it('should create an address', async () => {
			const { id, ...input } = mockAddress;
			const expected = { data: mockAddress, error: null };
			vi.mocked(addressRepository.createAddress).mockResolvedValue(
				expected as never,
			);

			const result = await addressService.createAddress(input);

			expect(addressRepository.createAddress).toHaveBeenCalledWith(input);
			expect(result).toEqual(expected);
		});
	});

	describe('updateAddress', () => {
		it('should update an address by id', async () => {
			const update = { street: 'Rua Nova' };
			const expected = { data: { ...mockAddress, ...update }, error: null };
			vi.mocked(addressRepository.updateAddress).mockResolvedValue(
				expected as never,
			);

			const result = await addressService.updateAddress('1', update);

			expect(addressRepository.updateAddress).toHaveBeenCalledWith('1', update);
			expect(result).toEqual(expected);
		});
	});

	describe('deleteAddress', () => {
		it('should delete an address by id', async () => {
			const expected = { data: mockAddress, error: null };
			vi.mocked(addressRepository.deleteAddress).mockResolvedValue(
				expected as never,
			);

			const result = await addressService.deleteAddress('1');

			expect(addressRepository.deleteAddress).toHaveBeenCalledWith('1');
			expect(result).toEqual(expected);
		});
	});
});
