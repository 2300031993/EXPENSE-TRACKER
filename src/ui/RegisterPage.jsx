import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function RegisterPage({ onSwitchToLogin }) {
	const { register } = useAuth();
	const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!form.name.trim()) return setError('Name is required');
		if (form.password.length < 6) return setError('Password must be at least 6 characters');
		if (form.password !== form.confirm) return setError('Passwords do not match');
		setLoading(true);
		const res = await register(form.name, form.email, form.password);
		if (!res.success) setError(res.message || 'Registration failed');
		setLoading(false);
	}

	return (
		<div className="auth-container">
			<div className="auth-card">
				<div className="auth-header">
					<h1>Create Account</h1>
					<p>Start tracking your expenses today</p>
				</div>
				<form className="auth-form" onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="name">Full Name</label>
						<input id="name" type="text" placeholder="Your name" value={form.name} onChange={(e)=>setForm(f=>({...f,name:e.target.value}))} disabled={loading} required />
					</div>
					<div className="form-group">
						<label htmlFor="email">Email</label>
						<input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e)=>setForm(f=>({...f,email:e.target.value}))} disabled={loading} required />
					</div>
					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input id="password" type="password" placeholder="Create a password" value={form.password} onChange={(e)=>setForm(f=>({...f,password:e.target.value}))} disabled={loading} required />
					</div>
					<div className="form-group">
						<label htmlFor="confirm">Confirm Password</label>
						<input id="confirm" type="password" placeholder="Confirm password" value={form.confirm} onChange={(e)=>setForm(f=>({...f,confirm:e.target.value}))} disabled={loading} required />
					</div>
					{error && <div className="error-message">{error}</div>}
					<button className="auth-button" type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</button>
				</form>
				<div className="auth-footer">
					<p>Already have an account? <button className="link-button" type="button" onClick={onSwitchToLogin} disabled={loading}>Sign in</button></p>
				</div>
			</div>
		</div>
	);
}

