import { formatINR } from './currency';

export function Summary({ total, expenses }) {
	const byCategory = expenses.reduce((acc, e) => {
		acc[e.category] = (acc[e.category] ?? 0) + e.amount;
		return acc;
	}, {});

	return (
		<div className="summary">
			<div className="card">
				<h2>Total</h2>
				<div className="total">{formatINR(total)}</div>
			</div>
			<div className="card">
				<h3>By Category</h3>
				<div className="chips">
					{Object.entries(byCategory).length === 0 ? (
						<span className="muted">No data</span>
					) : (
						Object.entries(byCategory).map(([cat, amt]) => (
							<span className="chip" key={cat}>
								{cat}: {formatINR(amt)}
							</span>
						))
					)}
				</div>
			</div>
		</div>
	);
}



