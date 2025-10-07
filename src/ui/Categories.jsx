import React, { useMemo, useState } from 'react';
import { formatINR } from './currency';
import { getCategoryMeta } from './categoryMeta';

const defaults = ['Food','Transport','Utilities','Entertainment','Shopping','Healthcare','Education','Travel','Other'];

export function Categories({ expenses }) {
	const [custom, setCustom] = useState([]);
	const [name, setName] = useState('');

	const stats = useMemo(() => {
		const s = {};
		expenses.forEach(e => {
			s[e.category] ??= { total:0, count:0, last:null };
			s[e.category].total += Number(e.amount||0);
			s[e.category].count += 1;
			s[e.category].last = new Date(e.date);
		});
		return s;
	}, [expenses]);

	const all = [...defaults, ...custom];
	const total = expenses.reduce((a,e)=>a+Number(e.amount||0),0);

	function addCategory() {
		const n = name.trim();
		if (!n) return;
		if (all.includes(n)) return;
		setCustom(prev => [...prev, n]);
		setName('');
	}

	function removeCategory(c) {
		setCustom(prev => prev.filter(x => x !== c));
	}

	const sorted = all.slice().sort((a,b)=>{
		const ta = stats[a]?.total || 0;
		const tb = stats[b]?.total || 0;
		return tb - ta;
	});

	return (
		<div className="categories-page">
			<div className="page-header"><h1>Categories</h1><p>Manage categories and view spending by category</p></div>

			<div className="add-category-section">
				<h3>Add Custom Category</h3>
				<div className="add-category-form">
					<input className="category-input" placeholder="Enter category name..." value={name} onChange={(e)=>setName(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&addCategory()} />
					<button className="add-category-btn" onClick={addCategory}>Add Category</button>
				</div>
			</div>

			<div className="categories-grid">
				{sorted.map(c => {
					const s = stats[c];
					const pct = s ? (s.total/(total||1))*100 : 0;
					const isCustom = custom.includes(c);
					const meta = getCategoryMeta(c);
					return (
						<div key={c} className="category-card">
							<div className="category-header">
								<h4 className="category-name"><span style={{marginRight:8}}>{meta.icon}</span>{c}</h4>
								{isCustom && <button className="remove-category-btn" onClick={()=>removeCategory(c)}>✕</button>}
							</div>
							{s ? (
								<div className="category-stats">
									<div className="stat-row"><span className="stat-label">Total Spent:</span><span className="stat-value">{formatINR(s.total)}</span></div>
									<div className="stat-row"><span className="stat-label">Transactions:</span><span className="stat-value">{s.count}</span></div>
									<div className="stat-row"><span className="stat-label">Percentage:</span><span className="stat-value">{pct.toFixed(1)}%</span></div>
									<div className="category-progress"><div className="progress-bar" style={{ width: `${Math.min(pct,100)}%` }}></div></div>
								</div>
							) : (
								<div className="no-data">No expenses in this category</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
