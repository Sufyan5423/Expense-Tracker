import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [month, setMonth] = useState("");
  const [salary, setSalary] = useState(0);
  const [salaryInput, setSalaryInput] = useState("");
  const [expenses, setExpenses] = useState([]);

  const [category, setCategory] = useState("");
  const [customName, setCustomName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);

  const key = month;

  /* LOAD DATA */
  useEffect(() => {
    if (!month) return;
    const data = JSON.parse(localStorage.getItem(key)) || {
      salary: 0,
      expenses: [],
    };
    setSalary(data.salary);
    setExpenses(data.expenses);
    setSalaryInput(data.salary);
  }, [month]);

  /* SAVE DATA */
  const saveData = (newSalary, newExpenses) => {
    localStorage.setItem(key, JSON.stringify({ salary: newSalary, expenses: newExpenses }));
  };

  /* SET OR EDIT SALARY */
  const handleSetSalary = () => {
    if (!month) return alert("Select month first");
    if (+salaryInput <= 0) return alert("Enter valid salary");
    setSalary(+salaryInput);
    saveData(+salaryInput, expenses);
  };

  /* ADD OR EDIT EXPENSE */
  const addExpense = (e) => {
    e.preventDefault();
    if (salary === 0) return alert("Set salary first");

    const name = category === "Other" ? customName.trim() : category;
    if (!name) return alert("Enter expense name");

    if (editId) {
      // Edit existing expense
      const updatedExpenses = expenses.map(exp =>
        exp.id === editId ? { ...exp, name, amount: +amount, date } : exp
      );
      setExpenses(updatedExpenses);
      saveData(salary, updatedExpenses);
      setEditId(null);
    } else {
      // Add new expense
      const newExpense = { id: Date.now(), name, amount: +amount, date };
      const updatedExpenses = [...expenses, newExpense];
      setExpenses(updatedExpenses);
      saveData(salary, updatedExpenses);
    }

    setCategory("");
    setCustomName("");
    setAmount("");
    setDate("");
  };

  /* DELETE EXPENSE */
  const deleteExpense = (id) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    saveData(salary, updated);
  };

  /* EDIT EXPENSE */
  const editExpense = (id) => {
    const exp = expenses.find(e => e.id === id);
    setCategory(exp.name === "Food" || exp.name === "Travel" || exp.name === "Bills" || exp.name === "Shopping" ? exp.name : "Other");
    setCustomName(exp.name !== "Food" && exp.name !== "Travel" && exp.name !== "Bills" && exp.name !== "Shopping" ? exp.name : "");
    setAmount(exp.amount);
    setDate(exp.date);
    setEditId(id);
  };

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const remaining = salary - totalExpense;

  /* EXPORT CSV */
  const exportCSV = () => {
    if (expenses.length === 0) return alert("No expenses");
    let csv = "Expense,Amount,Date\n";
    expenses.forEach(e => {
      csv += `${e.name},${e.amount},${e.date}\n`;
    });
    csv += `\nTOTAL EXPENSE,${totalExpense}\nREMAINING SALARY,${remaining}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `expense_${month}.csv`;
    a.click();
  };

  /* RESET APP */
  const resetApp = () => {
    if (!confirm("Reset everything?")) return;
    localStorage.clear();
    location.reload();
  };

  return (
    <div className="app">
      <h2>Salary Expense Tracker</h2>

      <div className="card month-picker">
        <label>Select Month</label>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
      </div>

      <div className="card">
        <h3>Monthly Salary</h3>
        <input
          type="number"
          placeholder="Enter salary"
          value={salaryInput}
          onChange={e => setSalaryInput(e.target.value)}
        />
        <button onClick={handleSetSalary}>Set / Edit Salary</button>
      </div>

      <div className="summary">
        <div className="box">
          <p>Salary</p>
          <h4>₹{salary}</h4>
        </div>
        <div className="box">
          <p>Total Expense</p>
          <h4>₹{totalExpense}</h4>
        </div>
        <div className="box">
          <p>Remaining</p>
          <h4>₹{remaining}</h4>
        </div>
      </div>

      <div className="card">
        <h3>Add Expense</h3>
        <form onSubmit={addExpense}>
          <select value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">Select Category</option>
            <option>Food</option>
            <option>Travel</option>
            <option>Bills</option>
            <option>Shopping</option>
            <option value="Other">Other</option>
          </select>

          {category === "Other" && (
            <input
              type="text"
              placeholder="Enter expense name"
              value={customName}
              onChange={e => setCustomName(e.target.value)}
            />
          )}

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />

          <button>{editId ? "Update Expense" : "Add Expense"}</button>
        </form>
      </div>

      <div className="actions">
        <button onClick={exportCSV}>Export to Excel</button>
        <button className="danger" onClick={resetApp}>Reset App</button>
      </div>

      <ul>
        {expenses.map(e => (
          <li key={e.id}>
            <div>
              <strong>{e.name}</strong><br />
              <small>{e.date}</small>
            </div>
            <div className="expense-actions">
            
              ₹{e.amount}
                <span className="edit" onClick={() => editExpense(e.id)}>✎</span>
              <span className="delete" onClick={() => deleteExpense(e.id)}>X</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
