function TransactionsPage({
  transactions,
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  deleteTransaction,
  handleEditTransaction,
  exportToCSV,
}) {
  const categories = [
    "All",
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Salary",
    "Freelance",
    "Other",
  ];

  const filteredTransactions = transactions
    .filter((transaction) => {
      const search = searchText.toLowerCase();

      return (
        transaction.title.toLowerCase().includes(search) ||
        transaction.category.toLowerCase().includes(search)
      );
    })
    .filter((transaction) => {
      return (
        categoryFilter === "All" ||
        transaction.category === categoryFilter
      );
    })
    .sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount),
      0
    );

  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-violet-600">
            FINANCIAL RECORDS
          </p>

          <h1 className="mt-1 text-3xl font-extrabold text-slate-900 dark:text-white">
            Transactions
          </h1>

          <p className="mt-2 text-slate-500 dark:text-slate-400">
            View, search, edit and manage all your transactions.
          </p>
        </div>

        <button
          type="button"
          onClick={exportToCSV}
          className="rounded-2xl bg-violet-600 px-5 py-3 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700"
        >
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Transactions
          </p>

          <p className="mt-2 text-3xl font-extrabold text-slate-900 dark:text-white">
            {transactions.length}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Income
          </p>

          <p className="mt-2 text-3xl font-extrabold text-emerald-600">
            ₹{totalIncome.toLocaleString("en-IN")}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Total Expenses
          </p>

          <p className="mt-2 text-3xl font-extrabold text-rose-600">
            ₹{totalExpense.toLocaleString("en-IN")}
          </p>
        </div>

      </div>

      {/* Search + Filter */}
      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="grid gap-4 md:grid-cols-[1fr_220px]">

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search transactions..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950"
          />

          <select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(event.target.value)
            }
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950"
          >
            {categories.map((category) => (
              <option
                key={category}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Transactions */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
            All Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {filteredTransactions.length} transaction
            {filteredTransactions.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl dark:bg-slate-800">
              📭
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
              No transactions found
            </h3>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Try changing your search or category filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Transaction
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    Type
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Amount
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-950"
                  >

                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {transaction.title}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                        {transaction.category}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-500 dark:text-slate-400">
                      {transaction.date}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={
                          transaction.type === "income"
                            ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                        }
                      >
                        {transaction.type === "income"
                          ? "Income"
                          : "Expense"}
                      </span>
                    </td>

                    <td
                      className={`px-6 py-5 text-right font-extrabold ${
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "+"
                        : "-"}
                      ₹
                      {Number(
                        transaction.amount
                      ).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() =>
                            handleEditTransaction(
                              transaction
                            )
                          }
                          className="rounded-xl bg-violet-100 px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-200 dark:bg-violet-500/10 dark:text-violet-400"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            deleteTransaction(
                              transaction.id
                            )
                          }
                          className="rounded-xl bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-200 dark:bg-rose-500/10 dark:text-rose-400"
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default TransactionsPage;