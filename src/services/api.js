// Local storage based API for frontend-only app

export class LocalStorageService {
  getStorageKey() {
    const user = localStorage.getItem('expense-tracker-user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData.id) return `expense-tracker-expenses-${userData.id}`;
      } catch {}
    }
    return 'expense-tracker-expenses';
  }

  getExpensesFromStorage() {
    try {
      const key = this.getStorageKey();
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to parse expenses from localStorage:', e);
      return [];
    }
  }

  saveExpensesToStorage(expenses) {
    try {
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(expenses));
    } catch (e) {
      console.error('Failed to save expenses:', e);
    }
  }

  // Standardized response shape
  createResponse(success, data, message, error) {
    const res = { success };
    if (data !== undefined) res.data = data;
    if (message) res.message = message;
    if (error) res.error = error;
    return res;
  }

  async getExpenses() {
    try {
      const expenses = this.getExpensesFromStorage();
      return this.createResponse(true, expenses);
    } catch {
      return this.createResponse(false, undefined, undefined, 'Failed to load expenses');
    }
  }

  async getExpense(id) {
    try {
      const expenses = this.getExpensesFromStorage();
      const exp = expenses.find(e => e.id === id);
      return exp
        ? this.createResponse(true, exp)
        : this.createResponse(false, undefined, undefined, 'Expense not found');
    } catch {
      return this.createResponse(false, undefined, undefined, 'Failed to load expense');
    }
  }

  async createExpense(expense) {
    try {
      const expenses = this.getExpensesFromStorage();
      const now = new Date().toISOString();
      const newExpense = {
        id: crypto.randomUUID(),
        title: expense.title,
        amount: Number(expense.amount),
        category: expense.category,
        date: expense.date,
        created_at: now,
        updated_at: now,
      };
      expenses.unshift(newExpense);
      this.saveExpensesToStorage(expenses);
      return this.createResponse(true, newExpense);
    } catch {
      return this.createResponse(false, undefined, undefined, 'Failed to create expense');
    }
  }

  async updateExpense(id, updates) {
    try {
      const expenses = this.getExpensesFromStorage();
      const idx = expenses.findIndex(e => e.id === id);
      if (idx === -1) return this.createResponse(false, undefined, undefined, 'Expense not found');
      const updated = { ...expenses[idx], ...updates, updated_at: new Date().toISOString() };
      if (updated.amount != null) updated.amount = Number(updated.amount);
      expenses[idx] = updated;
      this.saveExpensesToStorage(expenses);
      return this.createResponse(true, updated);
    } catch {
      return this.createResponse(false, undefined, undefined, 'Failed to update expense');
    }
  }

  async deleteExpense(id) {
    try {
      const expenses = this.getExpensesFromStorage();
      const next = expenses.filter(e => e.id !== id);
      if (next.length === expenses.length) return this.createResponse(false, undefined, undefined, 'Expense not found');
      this.saveExpensesToStorage(next);
      return this.createResponse(true);
    } catch {
      return this.createResponse(false, undefined, undefined, 'Failed to delete expense');
    }
  }

  async getExpensesSummary() {
    try {
      const expenses = this.getExpensesFromStorage();
      const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);
      const byCategory = expenses.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
        return acc;
      }, {});
      return this.createResponse(true, { total, byCategory });
    } catch {
      return this.createResponse(false, undefined, undefined, 'Failed to calculate summary');
    }
  }

  async healthCheck() {
    return this.createResponse(true, {
      message: 'Local storage service is running',
      timestamp: new Date().toISOString(),
      uptime: 0,
    });
  }
}

export const apiService = new LocalStorageService();


