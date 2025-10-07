import React, { useMemo, useState } from 'react';
import { formatINR } from './currency';
import { getCategoryMeta } from './categoryMeta';

export function Reports({ expenses }) {
	const [period, setPeriod] = useState('month');

	const filtered = useMemo(() => {
		if (period === 'all') return expenses;
		const now = new Date();
		const cutoff = new Date();
		if (period === 'week') cutoff.setDate(now.getDate()-7);
		if (period === 'month') cutoff.setMonth(now.getMonth()-1);
		if (period === 'year') cutoff.setFullYear(now.getFullYear()-1);
		return expenses.filter(e => new Date(e.date) >= cutoff);
	}, [expenses, period]);

	const total = filtered.reduce((s,e)=>s+Number(e.amount||0),0);
	const count = filtered.length;
	const avg = count ? total / count : 0;

	const byCategory = filtered.reduce((acc,e)=>{
		acc[e.category]=(acc[e.category]||0)+Number(e.amount||0);
		return acc;
	},{});
	const topCategory = Object.entries(byCategory).sort(([,a],[,b])=>b-a)[0];

	const daily = filtered.reduce((acc,e)=>{
		const key = new Date(e.date).toDateString();
		acc[key]=(acc[key]||0)+Number(e.amount||0);
		return acc;
	},{ });
	const dailyArr = Object.entries(daily).sort(([a],[b])=>new Date(a)-new Date(b)).slice(-7);
	const maxDaily = Math.max(1, ...dailyArr.map(([,v])=>v));

	return (
		<div className="reports-page">
			<div className="page-header"><h1>Reports & Analytics</h1><p>Detailed insights into your spending</p></div>
			<div className="period-selector">
				<h3>Select Period</h3>
				<div className="period-buttons">
					{[{value:'week',label:'Last 7 Days'},{value:'month',label:'Last Month'},{value:'year',label:'Last Year'},{value:'all',label:'All Time'}].map(p=> (
						<button key={p.value} className={`period-btn ${period===p.value?'active':''}`} onClick={()=>setPeriod(p.value)}>{p.label}</button>
					))}
				</div>
			</div>

			<div className="metrics-section">
				<div className="metric-card"><div className="metric-icon">💰</div><div className="metric-content"><h3>Total Spending</h3><div className="metric-value">{formatINR(total)}</div><div className="metric-subtitle">{count} transactions</div></div></div>
				<div className="metric-card"><div className="metric-icon">📊</div><div className="metric-content"><h3>Average Transaction</h3><div className="metric-value">{formatINR(avg)}</div><div className="metric-subtitle">Per transaction</div></div></div>
				<div className="metric-card"><div className="metric-icon">🏆</div><div className="metric-content"><h3>Top Category</h3><div className="metric-value">{topCategory?`${getCategoryMeta(topCategory[0]).icon} ${topCategory[0]}`:'None'}</div><div className="metric-subtitle">{topCategory?formatINR(topCategory[1]):'No data'}</div></div></div>
			</div>

			<div className="charts-section">
				<div className="chart-card">
					<h3>Spending by Category</h3>
					<div className="category-chart">
						{Object.entries(byCategory).length===0 ? (
							<div className="no-data">No data available</div>
						) : (
							Object.entries(byCategory).sort(([,a],[,b])=>b-a).map(([cat, amt]) => {
								const meta = getCategoryMeta(cat);
								const p = (amt/(total||1))*100;
								return (
									<div key={cat} className="category-bar-item">
										<div className="category-info"><span className="category-name"><span style={{marginRight:6}}>{meta.icon}</span>{cat}</span><span className="category-amount">{formatINR(amt)}</span></div>
										<div className="category-bar"><div className="category-fill" style={{ width: `${p}%` }}></div></div>
										<div className="category-percentage">{p.toFixed(1)}%</div>
									</div>
								);
							})
						)}
					</div>
				</div>

				<div className="chart-card">
					<h3>Daily Spending Trend</h3>
					<div className="daily-chart">
						{dailyArr.length===0 ? (
							<div className="no-data">No data available</div>
						) : (
							<div className="daily-bars">
								{dailyArr.map(([date, amt]) => {
									const h = (amt/maxDaily)*100;
									return (
										<div key={date} className="daily-bar">
											<div className="daily-bar-fill" style={{ height: `${h}%` }}></div>
											<div className="daily-bar-label">{new Date(date).toLocaleDateString(undefined,{weekday:'short'})}</div>
											<div className="daily-bar-amount">{formatINR(amt)}</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="insights-section">
				<h3>Insights</h3>
				<div className="insights-grid">
					<div className="insight-card"><div className="insight-icon">💡</div><div className="insight-content"><h4>Spending Pattern</h4><p>{topCategory?`You spend most on ${topCategory[0]} (${((topCategory[1]/(total||1))*100).toFixed(1)}%)`:'No spending data available'}</p></div></div>
					<div className="insight-card"><div className="insight-icon">📈</div><div className="insight-content"><h4>Transaction Frequency</h4><p>{count?`You make an average of ${(count/30).toFixed(1)} transactions per day`:'No transaction data available'}</p></div></div>
					<div className="insight-card"><div className="insight-icon">🎯</div><div className="insight-content"><h4>Budget Suggestion</h4><p>{total?`Consider a monthly budget of ${formatINR(total*1.2)} based on current spending`:'Start tracking expenses to get suggestions'}</p></div></div>
				</div>
			</div>
		</div>
	);
}
