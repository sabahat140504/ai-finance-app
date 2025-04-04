import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const staticResponses = {
  "How do I budget on a low income?": "Try the 50/30/20 rule: 50% for needs, 30% for wants, 20% for savings. Track every expense and avoid impulse buys.",
  "How can I reduce unnecessary spending?": "Start by tracking all spending, then identify recurring costs that can be reduced (e.g. subscriptions, takeout). Use cash instead of cards for better control.",
  "How can students save money effectively?": "Use student discounts, budget for essentials first, cook at home, and avoid credit card debt. Try to set aside even small amounts regularly.",
  "What are good saving habits to build early?": "Automate your savings, set clear financial goals, and review your budget monthly. Small habits now build strong financial discipline later."
};

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [newExpense, setNewExpense] = useState({ description: "", amount: "", category: "Food" });
  const [budget, setBudget] = useState(500);

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleAsk = () => {
    setResponse(staticResponses[query] || "Please select a supported question from the dropdown.");
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) return;

    setExpenses([...expenses, { ...newExpense, amount: parseFloat(newExpense.amount) }]);
    setNewExpense({ description: "", amount: "", category: "Food" });
  };

  const pieData = Object.entries(
    expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F"];

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem" }}>
      <h1>💰 Finance Assistant</h1>

      {/* Static Q&A Section */}
      <label><strong>Select a budgeting question:</strong></label>
      <select
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", padding: "10px", fontSize: "16px", marginBottom: "10px" }}
      >
        <option value="">-- Choose a question --</option>
        {Object.keys(staticResponses).map((q, i) => (
          <option key={i} value={q}>{q}</option>
        ))}
      </select>
      <button onClick={handleAsk} style={{ padding: "10px 20px" }}>Ask</button>

      <div style={{ marginTop: "20px", whiteSpace: "pre-wrap" }}>
        <strong>Response:</strong>
        <p>{response}</p>
      </div>

      {/* Expense Tracker */}
      <hr style={{ margin: "2rem 0" }} />
      <h2>📋 Track Your Expenses</h2>

      {/* Budget input */}
      <div style={{ marginBottom: "1rem" }}>
        <label><strong>Set Your Budget: £</strong></label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(parseFloat(e.target.value))}
          style={{ padding: "8px", width: "100px", marginLeft: "10px" }}
        />
      </div>

      <form onSubmit={handleExpenseSubmit}>
        <input
          type="text"
          placeholder="Description"
          value={newExpense.description}
          onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          style={{ padding: "8px", width: "58%", marginRight: "10px" }}
        />
        <input
          type="number"
          placeholder="Amount (£)"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          style={{ padding: "8px", width: "20%", marginRight: "10px" }}
        />
        <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          style={{ padding: "8px", width: "20%", marginRight: "10px" }}
        >
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Utilities">Utilities</option>
          <option value="Other">Other</option>
        </select>
        <button type="submit">Add</button>
      </form>

      <div style={{ marginTop: "1rem", fontWeight: "bold" }}>
        Total Spent: £{expenses.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}
      </div>

      {expenses.reduce((acc, item) => acc + item.amount, 0) > budget && (
        <div style={{ color: "red", marginTop: "0.5rem" }}>
          ⚠️ You've gone over your £{budget} budget!
        </div>
      )}

      <ul style={{ marginTop: "1rem" }}>
        {expenses.map((exp, index) => (
          <li key={index}>
            {exp.description} (£{exp.amount.toFixed(2)}) – {exp.category}
          </li>
        ))}
      </ul>

      {/* Pie Chart */}
      {expenses.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>📊 Spending Breakdown</h3>
          <PieChart width={300} height={300}>
            <Pie
              dataKey="value"
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}
    </div>
  );
}

export default App;
