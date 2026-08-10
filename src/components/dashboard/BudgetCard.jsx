export default function BudgetCard({
  monthlyBudget,
  setMonthlyBudget,
  remainingBudget,
  budgetPercentage,
  expense,
}) {
  return (
    <section className="mt-6 rounded-3xl bg-white dark:bg-slate-900 p-6 shadow-soft">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">Monthly Budget</h2>

        <input
  type="number"
  value={monthlyBudget}
  onChange={(e) => setMonthlyBudget(Number(e.target.value))}
  className="w-32 rounded-lg border px-2 py-1 text-right font-bold text-violet-600"
/>
      </div>

      <div className="mt-5 h-3 rounded-full overflow-hidden bg-slate-200">
        <div
          className="h-full bg-violet-600"
          style={{ width: `${budgetPercentage}%` }}
        />
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <span>
          Spent: <strong>₹{expense.toLocaleString()}</strong>
        </span>

        <span>
          Remaining: <strong>₹{remainingBudget.toLocaleString()}</strong>
        </span>
      </div>
    </section>
  );
}