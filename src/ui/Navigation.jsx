import React from 'react';

const items = [
	{ id: 'dashboard', label: 'Dashboard', icon: '📊' },
	{ id: 'expenses', label: 'Expenses', icon: '💰' },
	{ id: 'transactions', label: 'Transactions', icon: '📝' },
	{ id: 'categories', label: 'Categories', icon: '🏷️' },
	{ id: 'reports', label: 'Reports', icon: '📈' },
	{ id: 'settings', label: 'Settings', icon: '⚙️' },
];

export function Navigation({ currentPage, onPageChange }) {
	return (
		<nav className="navigation">
			<div className="nav-header">
				<div className="nav-logo"><span className="logo-icon">💳</span><span className="logo-text">ExpenseTracker</span></div>
			</div>
			<div className="nav-menu">
				{items.map((it) => (
					<button key={it.id} className={`nav-item ${currentPage===it.id?'active':''}`} onClick={()=>onPageChange(it.id)}>
						<span className="nav-icon">{it.icon}</span>
						<span className="nav-label">{it.label}</span>
					</button>
				))}
			</div>
			<div className="nav-footer">
				<div className="nav-info"><div className="info-icon">ℹ️</div><div className="info-text"><div className="info-title">Expense Tracker</div><div className="info-subtitle">v1.0.0</div></div></div>
			</div>
		</nav>
	);
}
