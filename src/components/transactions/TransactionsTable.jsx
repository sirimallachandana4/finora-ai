import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Pencil,
  X,
} from "lucide-react";

const categories = [
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

const categoryIcons = {
  Food: "🍔",
  Travel: "✈️",
  Shopping: "🛍️",
  Bills: "📄",
  Health: "🏥",
  Education: "📚",
  Entertainment: "🎬",
  Salary: "💰",
  Freelance: "💻",
  Other: "📦",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount));

function TransactionsTable({
  transactions,
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  deleteTransaction,
  handleEditTransaction,
  exportToCSV,
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-extrabold">
            Recent Transactions
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Review and manage your financial activity
          </p>
        </div>

        {/* EXPORT CSV */}
        <button
          type="button"
          onClick={exportToCSV}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-violet-500/10"
        >
          <Download size={17} />
          Export CSV
        </button>
      </div>

      {/* =====================================================
          SEARCH + FILTER
      ====================================================== */}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        {/* SEARCH */}
        <div className="relative flex-1">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={searchText}
            onChange={(event) =>
              setSearchText(event.target.value)
            }
            placeholder="Search transactions..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>

        {/* CATEGORY FILTER */}
        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950"
        >
          <option value="All">All categories</option>

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

      {/* =====================================================
          TRANSACTIONS TABLE
      ====================================================== */}

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-400 dark:border-slate-800">
              <th className="pb-3 font-semibold">
                Transaction
              </th>

              <th className="pb-3 font-semibold">
                Category
              </th>

              <th className="pb-3 font-semibold">
                Date
              </th>

              <th className="pb-3 text-right font-semibold">
                Amount
              </th>

              <th className="pb-3 text-right font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <AnimatePresence>
              {transactions.map((transaction) => (
                <motion.tr
                  key={transaction.id}
                  layout
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -20,
                  }}
                  className="border-b border-slate-100 last:border-0 dark:border-slate-800"
                >
                  {/* TRANSACTION */}
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-lg dark:bg-slate-800">
                        {categoryIcons[
                          transaction.category
                        ] || "💳"}
                      </div>

                      <div>
                        <p className="text-sm font-bold">
                          {transaction.title}
                        </p>

                        <p className="mt-0.5 text-xs capitalize text-slate-400">
                          {transaction.type}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* CATEGORY */}
                  <td className="py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold dark:bg-slate-800">
                      {transaction.category}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="py-4 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(
                      `${transaction.date}T00:00:00`
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  {/* AMOUNT */}
                  <td
                    className={`py-4 text-right text-sm font-extrabold ${
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {transaction.type === "income"
                      ? "+"
                      : "-"}

                    {formatCurrency(
                      transaction.amount
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {/* EDIT */}
                      <button
                        type="button"
                        onClick={() =>
                          handleEditTransaction(
                            transaction
                          )
                        }
                        title="Edit transaction"
                        className="rounded-xl p-2 text-blue-500 transition hover:bg-blue-50 dark:hover:bg-blue-500/10"
                      >
                        <Pencil size={17} />
                      </button>

                      {/* DELETE */}
                      <button
                        type="button"
                        onClick={() =>
                          deleteTransaction(
                            transaction.id
                          )
                        }
                        title="Delete transaction"
                        className="rounded-xl p-2 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-500/10"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* =================================================
            EMPTY STATE
        ================================================== */}

        {transactions.length === 0 && (
          <div className="py-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl dark:bg-slate-800">
              💳
            </div>

            <p className="mt-4 font-bold">
              No transactions found
            </p>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Try changing the search or filter.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TransactionsTable;