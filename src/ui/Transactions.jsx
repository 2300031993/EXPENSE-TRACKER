import React, { useMemo, useState } from 'react';
import { formatINR } from './currency';

export function Transactions({ expenses, onDelete }) {
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('All');
	const [sort, setSort] = useState('date-desc');
	const [dense, setDense] = useState(false);
	const [showCols, setShowCols] = useState({ desc: true, category: true, amount: true, date: true, action: true });
	const [showMenu, setShowMenu] = useState(false);

	const categories = useMemo(() => ['All', ...new Set(expenses.map((e) => e.category))], [expenses]);

	const filtered = useMemo(() => {
		let out = expenses.filter((e) => {
			const matchesText = e.title.toLowerCase().includes(search.toLowerCase());
			const matchesCat = category === 'All' || e.category === category;
			return matchesText && matchesCat;
		});
		out.sort((a, b) => {
			const [field, dir] = sort.split('-');
			let cmp = 0;
			if (field === 'date') cmp = new Date(a.date) - new Date(b.date);
			if (field === 'amount') cmp = Number(a.amount) - Number(b.amount);
			if (field === 'title') cmp = a.title.localeCompare(b.title);
			return dir === 'asc' ? cmp : -cmp;
		});
		return out;
	}, [expenses, search, category, sort]);

	const total = filtered.reduce((s, e) => s + Number(e.amount || 0), 0);

	return (
		<div className="transactions-page">
			<div className="page-header"><h1>Transaction History</h1><p>View and manage all your expenses</p></div>

			<div className="filters-section">
				<div className="search-box">
					<input className="search-input" placeholder="Search transactions..." value={search} onChange={(e)=>setSearch(e.target.value)} />
					<span className="search-icon">🔍</span>
				</div>
				<div className="filter-controls">
					<select className="filter-select" value={category} onChange={(e)=>setCategory(e.target.value)}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
					<select className="filter-select" value={sort} onChange={(e)=>setSort(e.target.value)}>
						<option value="date-desc">Date (Newest)</option>
						<option value="date-asc">Date (Oldest)</option>
						<option value="amount-desc">Amount (High to Low)</option>
						<option value="amount-asc">Amount (Low to High)</option>
						<option value="title-asc">Title (A-Z)</option>
						<option value="title-desc">Title (Z-A)</option>
					</select>
				</div>
				<div className="toolbar">
					<button className="density-toggle" onClick={()=>setDense(d=>!d)}>{dense? 'Comfortable' : 'Compact'}</button>
					<div style={{ position:'relative' }}>
						<button className="columns-btn" onClick={()=>setShowMenu(m=>!m)}>Columns</button>
						{showMenu && (
							<div className="columns-menu" onMouseLeave={()=>setShowMenu(false)}>
								<label><input type="checkbox" checked={showCols.desc} onChange={(e)=>setShowCols(c=>({...c,desc:e.target.checked}))} /> Description</label>
								<label><input type="checkbox" checked={showCols.category} onChange={(e)=>setShowCols(c=>({...c,category:e.target.checked}))} /> Category</label>
								<label><input type="checkbox" checked={showCols.amount} onChange={(e)=>setShowCols(c=>({...c,amount:e.target.checked}))} /> Amount</label>
								<label><input type="checkbox" checked={showCols.date} onChange={(e)=>setShowCols(c=>({...c,date:e.target.checked}))} /> Date</label>
								<label><input type="checkbox" checked={showCols.action} onChange={(e)=>setShowCols(c=>({...c,action:e.target.checked}))} /> Action</label>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="transactions-summary">
				<div className="summary-item"><span className="summary-label">Total Transactions:</span><span className="summary-value">{filtered.length}</span></div>
				<div className="summary-item"><span className="summary-label">Total Amount:</span><span className="summary-value">{formatINR(total)}</span></div>
			</div>

			<div className={`transactions-table ${dense? 'dense' : ''}`}>
				<div className="table-header">
					{showCols.desc && <div className="table-cell">Description</div>}
					{showCols.category && <div className="table-cell">Category</div>}
					{showCols.amount && <div className="table-cell">Amount</div>}
					{showCols.date && <div className="table-cell">Date</div>}
					{showCols.action && <div className="table-cell">Action</div>}
				</div>
				<div className="table-body">
					{filtered.length === 0 ? (
						<div className="no-transactions"><div className="no-transactions-icon">📝</div><h3>No transactions found</h3><p>Try adjusting your search or filters</p></div>
					) : (
						filtered.map(e => (
							<div key={e.id} className="table-row" style={dense? { padding: '8px 12px' } : undefined}>
								{showCols.desc && <div className="table-cell"><div className="transaction-title">{e.title}</div></div>}
								{showCols.category && <div className="table-cell"><span className="category-chip">{e.category}</span></div>}
								{showCols.amount && <div className="table-cell"><span className="amount-value">{formatINR(e.amount)}</span></div>}
								{showCols.date && <div className="table-cell"><span className="date-value">{new Date(e.date).toLocaleDateString()}</span></div>}
								{showCols.action && <div className="table-cell"><button className="delete-btn" onClick={()=>onDelete(e.id)} title="Delete">🗑️</button></div>}
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}
