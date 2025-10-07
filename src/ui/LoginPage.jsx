import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage({ onSwitchToRegister }) {
	const { login } = useAuth();
	const [form, setForm] = useState({ email: '', password: '' });
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		const res = await login(form.email, form.password);
		if (!res.success) setError(res.message || 'Login failed');
		setLoading(false);
	}

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-header">
					<h1>Welcome Back</h1>
					<p>Sign in to manage your expenses</p>
				</div>
				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} disabled={loading} required />
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input id="password" type="password" placeholder="Your password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} disabled={loading} required />
					</div>
					{error && <div className="error-message">{error}</div>}
					<button className="auth-button" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
				</form>
				<div className="auth-footer">
					<p>Don't have an account? <button className="link-button" type="button" onClick={onSwitchToRegister} disabled={loading}>Sign up</button></p>
				</div>
			</div>
		</div>
	);
}

