import { useState } from 'react';

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Shopping', 'Other'];

export function ExpenseForm({ onAdd }) {
	const [form, setForm] = useState({
		title: '',
		amount: 0,
		category: 'Other',
		date: new Date().toISOString().slice(0, 10),
	});
	const [error, setError] = useState(null);

	function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		if (!form.title.trim()) {
			setError('Title is required');
			return;
		}
		if (!Number.isFinite(form.amount) || form.amount <= 0) {
			setError('Amount must be greater than 0');
			return;
		}
		onAdd({ id: crypto.randomUUID(), ...form, amount: Number(form.amount) });
		setForm({ title: '', amount: 0, category: 'Other', date: new Date().toISOString().slice(0, 10) });
	}

	return (
		<form className="card" onSubmit={handleSubmit}>
			<h2>Add Expense</h2>
			<div className="grid">
				<label>
					<span>Title</span>
					<input
						required
						value={form.title}
						onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
						placeholder="e.g., Lunch"
					/>
				</label>
				<label>
					<span>Amount</span>
					<input
						type="number"
						min={0}
						step={0.01}
						value={form.amount}
						onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
					/>
				</label>
				<label>
					<span>Category</span>
					<select
						value={form.category}
						onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
					>
						{categories.map((c) => (
							<option key={c} value={c}>
								{c}
							</option>
						))}
					</select>
				</label>
				<label>
					<span>Date</span>
					<input
						type="date"
						value={form.date}
						onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
					/>
				</label>
			</div>
			{error && <div className="error">{error}</div>}
			<div className="actions">
				<button type="submit">Add</button>
			</div>
		</form>
	);
}



