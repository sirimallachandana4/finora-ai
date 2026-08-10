import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { CircleDollarSign } from "lucide-react";

function CategoryChart({ data, totalExpense }) {

    const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

  return (
    <section className="glass-card rounded-3xl p-5 shadow-soft sm:p-6">
      <div>
        <h2 className="text-lg font-extrabold">Expense Breakdown</h2>
        <p className="mt-1 text-sm text-slate-500">
          Spending distribution by category
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[320px] flex-col items-center justify-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <CircleDollarSign size={30} />
          </div>

          <p className="mt-4 font-bold">No expense data</p>

          <p className="mt-1 text-sm text-slate-500">
            Add an expense to view the category chart.
          </p>
        </div>
      ) : (
        <>
          <div className="relative mt-4 h-[230px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={94}
                  paddingAngle={4}
                >
                  {data.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-slate-500">Total spent</span>

              <span className="mt-1 text-xl font-extrabold">
                {formatCurrency(totalExpense)}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {data.map((item) => {
              const percentage =
                totalExpense > 0
                  ? Math.round((item.value / totalExpense) * 100)
                  : 0;

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2.5 dark:bg-slate-800/70"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />

                    <span className="text-xs font-semibold">
                      {item.name}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    {percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}

export default CategoryChart;