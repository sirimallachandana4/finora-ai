function AnalyticsPage({ transactions, totals, formatCurrency }) {
  const expenseTransactions = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const categoryTotals = {};

  expenseTransactions.forEach((transaction) => {
    categoryTotals[transaction.category] =
      (categoryTotals[transaction.category] || 0) +
      Number(transaction.amount);
  });

  const categories = Object.entries(categoryTotals).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold">
        Analytics
      </h1>

      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Understand your financial performance and spending patterns.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Total Income
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-emerald-500">
            {formatCurrency(totals.income)}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Total Expenses
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-rose-500">
            {formatCurrency(totals.expense)}
          </h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
          <p className="text-sm text-slate-500">
            Savings
          </p>

          <h2 className="mt-2 text-3xl font-extrabold text-violet-500">
            {formatCurrency(totals.balance)}
          </h2>
        </div>
      </div>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <h2 className="text-xl font-bold">
          Spending by Category
        </h2>

        <div className="mt-6 space-y-5">
          {categories.length === 0 ? (
            <p className="text-slate-500">
              No expense data available yet.
            </p>
          ) : (
            categories.map(([category, amount]) => {
              const percentage =
                totals.expense > 0
                  ? (amount / totals.expense) * 100
                  : 0;

              return (
                <div key={category}>
                  <div className="mb-2 flex justify-between">
                    <span className="font-semibold">
                      {category}
                    </span>

                    <span className="text-sm text-slate-500">
                      {formatCurrency(amount)}
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className="h-full rounded-full bg-violet-600"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;