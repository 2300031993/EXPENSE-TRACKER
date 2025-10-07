import { useMemo, useState, useEffect } from 'react';
import { ExpenseForm } from './ExpenseForm';
import { ExpenseList } from './ExpenseList';
import { Summary } from './Summary';
import { LoginPage } from './LoginPage';
import { RegisterPage } from './RegisterPage';
import { Dashboard } from './Dashboard';
import { Transactions } from './Transactions';
import { Categories } from './Categories';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { Navigation } from './Navigation';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

export function App() {
	const [expenses, setExpenses] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [isLogin, setIsLogin] = useState(true);
	const [currentPage, setCurrentPage] = useState('dashboard');
	const { user, isLoading: authLoading, logout } = useAuth();

	useEffect(() => { if (user) loadExpenses(); }, [user]);

	async function loadExpenses() {
		setLoading(true); setError(null);
		const response = await apiService.getExpenses();
		if (response.success && response.data) setExpenses(response.data); else setError(response.message||'Failed to load expenses');
		setLoading(false);
	}

	async function addExpense(expense) {
		const response = await apiService.createExpense(expense);
		if (response.success && response.data) setExpenses((p)=>[response.data, ...p]); else setError(response.message||'Failed to add expense');
	}
	async function deleteExpense(id) {
		const response = await apiService.deleteExpense(id);
		if (response.success) setExpenses((p)=>p.filter(e=>e.id!==id)); else setError(response.message||'Failed to delete expense');
	}

	const total = useMemo(()=>expenses.reduce((s,e)=>s+Number(e.amount||0),0),[expenses]);

	if (authLoading) return <div className="container"><div className="card">Loading...</div></div>;
	if (!user) return isLogin ? <LoginPage onSwitchToRegister={()=>setIsLogin(false)} /> : <RegisterPage onSwitchToLogin={()=>setIsLogin(true)} />;

	const renderPage = () => {
		switch (currentPage) {
			case 'dashboard': return <Dashboard expenses={expenses} total={total} />;
			case 'expenses': return (<div><Summary total={total} expenses={expenses} /><ExpenseForm onAdd={addExpense} /><ExpenseList expenses={expenses} onDelete={deleteExpense} /></div>);
			case 'transactions': return <Transactions expenses={expenses} onDelete={deleteExpense} />;
			case 'categories': return <Categories expenses={expenses} />;
			case 'reports': return <Reports expenses={expenses} />;
			case 'settings': return <Settings onExportData={exportData} onImportData={importData} onClearData={clearAllData} />;
			default: return <Dashboard expenses={expenses} total={total} />;
		}
	};

	function exportData() {
		const data = { expenses, exportDate: new Date().toISOString(), version: '1.0.0' };
		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a'); a.href = url; a.download = `expense-data-${new Date().toISOString().split('T')[0]}.json`; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
	}
	function importData(file) {
		const reader = new FileReader();
		reader.onload = (e) => { try { const data = JSON.parse(e.target?.result); if (Array.isArray(data.expenses)) { setExpenses(data.expenses); const key = `expense-tracker-expenses-${user?.id}`; localStorage.setItem(key, JSON.stringify(data.expenses)); } } catch (err) { console.error('Failed to import', err); } };
		reader.readAsText(file);
	}
	function clearAllData() { setExpenses([]); const key = `expense-tracker-expenses-${user?.id}`; localStorage.removeItem(key); }

	if (loading) {
		return (
			<div className="app-layout">
				<Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
				<div className="main-content"><div className="app-header"><h1>Expense Tracker</h1><div className="user-info"><span>Welcome, {user.name}</span><button className="logout-button" onClick={logout}>Logout</button></div></div><div className="card">Loading expenses...</div></div>
			</div>
		);
	}

	return (
		<div className="app-layout">
			<Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
			<div className="main-content">
				<div className="app-header"><h1>Expense Tracker</h1><div className="user-info"><span>Welcome, {user.name}</span><button className="logout-button" onClick={logout}>Logout</button></div></div>
				{error && <div className="card error">{error}<button onClick={loadExpenses} style={{marginLeft:10}}>Retry</button></div>}
				{renderPage()}
			</div>
		</div>
	);
}



