// ExpenseTracker.tsx
import React, { useReducer, useState, useMemo, useRef, useEffect } from 'react';

type Expense = {
  id: number;
  amount: number;
  category: string;
  date: string;
  paymentMode: string;
  notes?: string;
};

type State = {
  expenses: Expense[];
};

type Action =
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'CLEAR_EXPENSES' };

const initialState: State = {
  expenses: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    case 'CLEAR_EXPENSES':
      return { ...state, expenses: [] };
    default:
      return state;
  }
}

const ExpenseTracker: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [paymentMode, setPaymentMode] = useState('');
  const [notes, setNotes] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const totalSpent = useMemo(() => {
    return state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [state.expenses]);

  const highestExpense = useMemo(() => {
    return state.expenses.reduce(
      (prev, curr) => (curr.amount > prev.amount ? curr : prev),
      { id: 0, amount: -Infinity, category: '', date: '', paymentMode: '' }
    );
  }, [state.expenses]);

  const remainingAmount = useMemo(() => {
    const total = parseFloat(totalAmount) || 0;
    return total - totalSpent;
  }, [totalAmount, totalSpent]);

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0 || category.trim() === '' || date.trim() === '' || paymentMode.trim() === '') return;
    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: Date.now(),
        amount: amt,
        category,
        date,
        paymentMode,
        notes: notes.trim() ? notes : undefined,
      },
    });
    setAmount(''); setCategory(''); setDate(''); setPaymentMode(''); setNotes('');
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="tracker-container">
      <h2>Expense Tracker</h2>
      <div className="input-group">
        <label>Total Available Amount:</label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Enter total budget"
        />
      </div>
      <div className="total-summary">
        <h3>Available: Rs.{parseFloat(totalAmount) || 0}</h3>
        <h3>Spent: Rs.{totalSpent}</h3>
        <h3>Remaining: Rs.{remainingAmount}</h3>
      </div>

      <div className="input-group">
        <input
          type="number"
          ref={inputRef}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
        />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <input
          type="text"
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          placeholder="Payment Mode"
        />
        <input
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
        />
        <button onClick={handleAdd}>Add Expense</button>
        <button onClick={() => dispatch({ type: 'CLEAR_EXPENSES' })}>Clear</button>
      </div>

      <ul className="expense-list">
        {state.expenses.map((exp) => (
          <li
            key={exp.id}
            className={`expense-item ${highestExpense?.id === exp.id ? 'highest' : ''}`}
          >
            <strong>{exp.category}</strong>: Rs.{exp.amount}<br />
            📅 {exp.date} | 💳 {exp.paymentMode}<br />
            📝 {exp.notes || 'No notes'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
