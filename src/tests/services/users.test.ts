import { beforeEach, describe, expect, it, vi } from 'vitest';
import { usersRepository } from '@/repositories/users.js';
import { usersService } from '@/services/users.js';

vi.mock('@/repositories/users.js', () => ({
	usersRepository: {
		getAllUsers: vi.fn(),
		findUserById: vi.fn(),
		updateUser: vi.fn(),
		deleteUser: vi.fn(),
	},
}));

const mockUser = {
	id: 'user-1',
	email: 'test@email.com',
	name: 'Test User',
	phone: '11999999999',
	createdAt: '2025-01-01T00:00:00Z',
	updatedAt: '2025-01-01T00:00:00Z',
};

describe('UsersService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('getAllUsers', () => {
		it('should return all users', async () => {
			const expected = { data: [mockUser], error: null };
			vi.mocked(usersRepository.getAllUsers).mockResolvedValue(
				expected as never,
			);

			const result = await usersService.getAllUsers();

			expect(usersRepository.getAllUsers).toHaveBeenCalledOnce();
			expect(result).toEqual(expected);
		});
	});

	describe('getUserById', () => {
		it('should return a user by id', async () => {
			const expected = { data: mockUser, error: null };
			vi.mocked(usersRepository.findUserById).mockResolvedValue(
				expected as never,
			);

			const result = await usersService.getUserById('user-1');

			expect(usersRepository.findUserById).toHaveBeenCalledWith('user-1');
			expect(result).toEqual(expected);
		});
	});

	describe('updateUser', () => {
		it('should update a user by id', async () => {
			const update = { name: 'Updated Name' };
			const expected = { data: { ...mockUser, ...update }, error: null };
			vi.mocked(usersRepository.updateUser).mockResolvedValue(
				expected as never,
			);

			const result = await usersService.updateUser('user-1', update);

			expect(usersRepository.updateUser).toHaveBeenCalledWith('user-1', update);
			expect(result).toEqual(expected);
		});
	});

	describe('deleteUser', () => {
		it('should delete a user by id', async () => {
			const expected = { data: mockUser, error: null };
			vi.mocked(usersRepository.deleteUser).mockResolvedValue(
				expected as never,
			);

			const result = await usersService.deleteUser('user-1');

			expect(usersRepository.deleteUser).toHaveBeenCalledWith('user-1');
			expect(result).toEqual(expected);
		});
	});
});
