import { beforeEach, describe, expect, it, vi } from 'vitest';
import { supabase } from '@/lib/supabase.js';
import { authService } from '@/services/auth.js';

vi.mock('@/lib/supabase.js', () => ({
	supabase: {
		auth: {
			signUp: vi.fn(),
			signInWithPassword: vi.fn(),
		},
	},
}));

const mockRegister = {
	email: 'test@email.com',
	name: 'Test User',
	phone: '11999999999',
	password: '123456',
};

const mockLogin = {
	email: 'test@email.com',
	password: '123456',
};

describe('AuthService', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('signUp', () => {
		it('should return success message on signup', async () => {
			vi.mocked(supabase.auth.signUp).mockResolvedValue({} as never);

			const result = await authService.signUp(mockRegister);

			expect(supabase.auth.signUp).toHaveBeenCalledWith({
				email: mockRegister.email,
				password: mockRegister.password,
				options: {
					data: {
						name: mockRegister.name,
						phone: mockRegister.phone,
					},
				},
			});
			expect(result).toBe('User created successfully');
		});

		it('should return error message when signup fails', async () => {
			vi.mocked(supabase.auth.signUp).mockRejectedValue(
				new Error('signup failed'),
			);

			const result = await authService.signUp(mockRegister);

			expect(result).toBe('Signup error: Error: signup failed');
		});
	});

	describe('signIn', () => {
		it('should return token on successful signin', async () => {
			vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
				data: { session: { access_token: 'jwt-token-123' } },
			} as never);

			const result = await authService.signIn(mockLogin);

			expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
				email: mockLogin.email,
				password: mockLogin.password,
			});
			expect(result).toEqual({ token: 'jwt-token-123' });
		});

		it('should return invalid credentials when session is null', async () => {
			vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
				data: { session: null },
			} as never);

			const result = await authService.signIn(mockLogin);

			expect(result).toBe('Invalid credentials');
		});

		it('should return error message when signin fails', async () => {
			vi.mocked(supabase.auth.signInWithPassword).mockRejectedValue(
				new Error('signin failed'),
			);

			const result = await authService.signIn(mockLogin);

			expect(result).toBe('Signin error: Error: signin failed');
		});
	});
});
