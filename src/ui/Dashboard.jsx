import React from 'react';
import { formatINR } from './currency';
import { getCategoryMeta } from './categoryMeta';

export function Dashboard({ expenses, total }) {
	const now = new Date();
	const thisMonth = now.getMonth();
	const thisYear = now.getFullYear();

	const monthlyExpenses = expenses.filter((e) => {
		const d = new Date(e.date);
		return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
	});
	const monthlyTotal = monthlyExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);

	const categoryBreakdown = expenses.reduce((acc, e) => {
		acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
		return acc;
	}, {});

	const topCategory = Object.entries(categoryBreakdown).sort(([,a],[,b]) => b-a)[0];
	const recentExpenses = expenses.slice(0, 5);
	const averageExpense = expenses.length ? total / expenses.length : 0;

	return (
		<div className="dashboard">
			<div className="dashboard-header">
				<h1>Dashboard</h1>
				<p>Welcome back! Here's your expense overview.</p>
			</div>

			<div className="metrics-grid">
				<div className="metric-card"><div className="metric-icon">💰</div><div className="metric-content"><h3>Total Expenses</h3><div className="metric-value">{formatINR(total)}</div><div className="metric-subtitle">All time</div></div></div>
				<div className="metric-card"><div className="metric-icon">📅</div><div className="metric-content"><h3>This Month</h3><div className="metric-value">{formatINR(monthlyTotal)}</div><div className="metric-subtitle">Current month</div></div></div>
				<div className="metric-card"><div className="metric-icon">📊</div><div className="metric-content"><h3>Average</h3><div className="metric-value">{formatINR(averageExpense)}</div><div className="metric-subtitle">Per expense</div></div></div>
				<div className="metric-card"><div className="metric-icon">🏆</div><div className="metric-content"><h3>Top Category</h3><div className="metric-value">{topCategory ? `${getCategoryMeta(topCategory[0]).icon} ${topCategory[0]}` : 'None'}</div><div className="metric-subtitle">{topCategory ? formatINR(topCategory[1]) : 'No expenses'}</div></div></div>
			</div>

			<div className="analytics-grid">
				<div className="analytics-card">
					<h3>Expenses by Category</h3>
					<div className="category-chart">
						{Object.entries(categoryBreakdown).length === 0 ? (
							<div className="no-data">No expenses yet</div>
						) : (
							Object.entries(categoryBreakdown).map(([cat, amt]) => {
								const meta = getCategoryMeta(cat);
								const p = (amt / (total || 1)) * 100;
								return (
									<div key={cat} className="category-item">
										<div className="category-info"><span className="category-name"><span style={{marginRight:6}}>{meta.icon}</span>{cat}</span><span className="category-amount">{formatINR(amt)}</span></div>
										<div className="category-bar"><div className="category-fill" style={{ width: `${p}%` }}></div></div>
										<div className="category-percentage">{p.toFixed(1)}%</div>
									</div>
								);
							})
						)}
					</div>
				</div>

				<div className="analytics-card">
					<h3>Recent Transactions</h3>
					<div className="recent-transactions">
						{recentExpenses.length === 0 ? (
							<div className="no-data">No recent transactions</div>
						) : (
							recentExpenses.map((e) => {
								const meta = getCategoryMeta(e.category);
								return (
									<div key={e.id} className="transaction-item">
										<div>
											<div className="transaction-title">{e.title}</div>
											<div className="transaction-meta"><span className="transaction-category"><span style={{marginRight:6}}>{meta.icon}</span>{e.category}</span><span className="transaction-date">{new Date(e.date).toLocaleDateString()}</span></div>
										</div>
										<div className="transaction-amount">{formatINR(e.amount)}</div>
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>

			<div className="quick-stats">
				<div className="stat-item"><div className="stat-number">{expenses.length}</div><div className="stat-label">Total Transactions</div></div>
				<div className="stat-item"><div className="stat-number">{Object.keys(categoryBreakdown).length}</div><div className="stat-label">Categories Used</div></div>
				<div className="stat-item"><div className="stat-number">{monthlyExpenses.length}</div><div className="stat-label">This Month</div></div>
			</div>
		</div>
	);
}
