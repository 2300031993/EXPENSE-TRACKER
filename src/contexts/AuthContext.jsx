import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(undefined);

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
	return ctx;
}

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		try {
			const raw = localStorage.getItem('expense-tracker-user');
			if (raw) setUser(JSON.parse(raw));
		} catch (e) {
			console.error('Failed to read user from localStorage', e);
		} finally {
			setIsLoading(false);
		}
	}, []);

	async function login(email, password) {
		try {
			const users = JSON.parse(localStorage.getItem('expense-tracker-users') || '[]');
			const found = users.find((u) => u.email === email && u.password === password);
			if (!found) return { success: false, message: 'Invalid email or password' };
			const { password: _pw, ...safe } = found;
			setUser(safe);
			localStorage.setItem('expense-tracker-user', JSON.stringify(safe));
			return { success: true };
		} catch (e) {
			console.error('login error', e);
			return { success: false, message: 'Login failed. Try again.' };
		}
	}

	async function register(name, email, password) {
		try {
			const users = JSON.parse(localStorage.getItem('expense-tracker-users') || '[]');
			if (users.find((u) => u.email === email)) {
				return { success: false, message: 'User already exists' };
			}
			const newUser = {
				id: crypto.randomUUID(),
				name,
				email,
				password,
				createdAt: new Date().toISOString(),
			};
			users.push(newUser);
			localStorage.setItem('expense-tracker-users', JSON.stringify(users));
			const { password: _pw, ...safe } = newUser;
			setUser(safe);
			localStorage.setItem('expense-tracker-user', JSON.stringify(safe));
			return { success: true };
		} catch (e) {
			console.error('register error', e);
			return { success: false, message: 'Registration failed. Try again.' };
		}
	}

	function logout() {
		setUser(null);
		localStorage.removeItem('expense-tracker-user');
	}

	const value = { user, isLoading, login, register, logout };
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

