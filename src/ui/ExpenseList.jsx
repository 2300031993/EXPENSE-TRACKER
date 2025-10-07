import { formatINR } from './currency';
import { getCategoryMeta } from './categoryMeta';

export function ExpenseList({ expenses, onDelete }) {
	if (expenses.length === 0) {
		return <div className="card muted">No expenses yet. Add your first one!</div>;
	}

	return (
		<div className="card">
			<h2>Expenses</h2>
			<ul className="list">
				{expenses.map((e) => {
					const meta = getCategoryMeta(e.category);
					return (
						<li key={e.id} className="list-item">
							<div className="list-main">
								<div className="title">{e.title}</div>
								<div className="meta">
									<span className={`chip ${meta.cls}`}>
										<span style={{marginRight:6}}>{meta.icon}</span>{e.category}
									</span>
									<span>{new Date(e.date).toLocaleDateString()}</span>
								</div>
							</div>
							<div className="amount">{formatINR(e.amount)}</div>
							<button className="delete" onClick={() => onDelete(e.id)} aria-label={`Delete ${e.title}`}>
								✕
							</button>
						</li>
					);
				})}
			</ul>
		</div>
	);
}



