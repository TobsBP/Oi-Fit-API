import { supabase } from '../lib/supabase';
import type { Login, Register } from '../types/auth';

export class AuthService {
	async signUp(userData: Register) {
		try {
			await supabase.auth.signUp({
				email: userData.email,
				password: userData.password,
				options: {
					data: {
						name: userData.name,
						phone: userData.phone,
					},
				},
			});

			return 'User created successfully';
		} catch (error) {
			return `Signup error: ${error}`;
		}
	}

	async signIn(userData: Login) {
		try {
			const { data } = await supabase.auth.signInWithPassword({
				email: userData.email,
				password: userData.password,
			});

			if (!data.session) {
				return 'Invalid credentials';
			}

			return { token: data.session.access_token };
		} catch (error) {
			return `Signin error: ${error}`;
		}
	}
}

export const authService = new AuthService();
