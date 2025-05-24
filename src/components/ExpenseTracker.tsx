import React, { useReducer, useState, useMemo, useRef, useEffect } from 'react';

type Expense = {
  id: number;
  amount: number;
  category: string;
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
      return {
        ...state,
        expenses: [...state.expenses, action.payload],
      };
    case 'CLEAR_EXPENSES':
      return {
        ...state,
        expenses: [],
      };
    default:
      return state;
  }
}

const ExpenseTracker: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [totalAmount, setTotalAmount] = useState(''); // 🆕 Total Available Amount

  const inputRef = useRef<HTMLInputElement>(null);

  const totalSpent = useMemo(() => {
    return state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [state.expenses]);

  const highestExpense = useMemo(() => {
    return state.expenses.reduce(
      (prev, curr) => (curr.amount > prev.amount ? curr : prev),
      { id: 0, amount: -Infinity, category: '' }
    );
  }, [state.expenses]);

  const remainingAmount = useMemo(() => {
    const total = parseFloat(totalAmount) || 0;
    return total - totalSpent;
  }, [totalAmount, totalSpent]);

  const handleAdd = () => {
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0 || category.trim() === '') return;
    dispatch({
      type: 'ADD_EXPENSE',
      payload: { id: Date.now(), amount: amt, category },
    });
    setAmount('');
    setCategory('');
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '20px auto', padding: '20px', border: '1px solid black' }}>
      <h2>Expense Tracker</h2>

      {/* 🔵 Total Available Amount Input */}
      <div>
        <label>Total Available Amount: </label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          placeholder="Enter total budget"
        />
      </div>

      <h3>Total Available: ${parseFloat(totalAmount) || 0}</h3>
      <h3>Total Spent: ${totalSpent}</h3>
      <h3>Remaining Balance: ${remainingAmount}</h3>

      <hr />

      <div>
        <input
          type="number"
          ref={inputRef}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Enter category"
        />
        <button onClick={handleAdd}>Add Expense</button>
        <button onClick={() => dispatch({ type: 'CLEAR_EXPENSES' })}>Clear Expenses</button>
      </div>

      <ul>
        {state.expenses.map(exp => (
          <li key={exp.id} style={{ backgroundColor: highestExpense?.id === exp.id ? '#caffbf' : 'white' }}>
            {exp.category}: ${exp.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpenseTracker;
