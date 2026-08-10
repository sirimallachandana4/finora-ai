import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CalendarDays,
  ChevronDown,
} from "lucide-react";

function FinancialOverview({ data }) {

    const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

  return (
    <section className="glass-card rounded-3xl p-5 shadow-soft sm:p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-extrabold">Financial Overview</h2>
          <p className="mt-1 text-sm text-slate-500">
            Income and expenses over the last six months
          </p>
        </div>

        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold dark:border-slate-700"
        >
          <CalendarDays size={16} />
          Last 6 months
          <ChevronDown size={15} />
        </button>
      </div>

      <div className="mt-7 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>

              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fb7185" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="#e2e8f0"
            />

            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => formatCurrency(value)}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid #e2e8f0",
              }}
            />

            <Area
              type="monotone"
              dataKey="income"
              stroke="#8b5cf6"
              strokeWidth={3}
              fill="url(#incomeGradient)"
            />

            <Area
              type="monotone"
              dataKey="expense"
              stroke="#fb7185"
              strokeWidth={3}
              fill="url(#expenseGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 text-xs font-semibold">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
          Income
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Expenses
        </span>
      </div>
    </section>
  );
}

export default FinancialOverview;