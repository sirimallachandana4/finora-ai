import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

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


function TransactionModal({
    isOpen,
    closeModal,
    formData,
    handleInputChange,
    handleSubmit,
    titleInputRef,
    editingTransaction,
}) {

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.button
            type="button"
            aria-label="Close modal overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            className="relative z-10 w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-extrabold">
  {editingTransaction ? "Edit Transaction" : "Add Transaction"}
</h2>

                <p className="mt-1 text-sm text-slate-500">
  {editingTransaction
    ? "Update your transaction details."
    : "Record a new income or expense."}
</p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:text-slate-900 dark:bg-slate-800 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="transaction-title"
                  className="text-sm font-bold"
                >
                  Transaction title
                </label>

                <input
                  ref={titleInputRef}
                  id="transaction-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Example: Swiggy order"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950"
                />

                <p className="mt-1 text-xs text-violet-500">
                  Smart category detection is enabled.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="transaction-amount"
                    className="text-sm font-bold"
                  >
                    Amount
                  </label>

                  <input
                    id="transaction-amount"
                    name="amount"
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="₹ 0"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>

                <div>
                  <label
                    htmlFor="transaction-date"
                    className="text-sm font-bold"
                  >
                    Date
                  </label>

                  <input
                    id="transaction-date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 dark:border-slate-700 dark:bg-slate-950"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="transaction-category"
                  className="text-sm font-bold"
                >
                  Category
                </label>

                <select
                  id="transaction-category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {categoryIcons[category]} {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-bold">Transaction type</p>

                <div className="mt-2 grid grid-cols-2 gap-3">
                  <label
                    className={`cursor-pointer rounded-2xl border p-3 text-center text-sm font-bold transition ${
                      formData.type === "expense"
                        ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-500/10"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="expense"
                      checked={formData.type === "expense"}
                      onChange={handleInputChange}
                      className="hidden"
                    />

                    Expense
                  </label>

                  <label
                    className={`cursor-pointer rounded-2xl border p-3 text-center text-sm font-bold transition ${
                      formData.type === "income"
                        ? "border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value="income"
                      checked={formData.type === "income"}
                      onChange={handleInputChange}
                      className="hidden"
                    />

                    Income
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold dark:border-slate-700"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700"
                >
                  {editingTransaction ? "Update Transaction" : "Add Transaction"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default TransactionModal;