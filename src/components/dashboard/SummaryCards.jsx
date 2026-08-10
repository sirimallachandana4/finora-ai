import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  MoreHorizontal,
  WalletCards,
  TrendingUp,
  TrendingDown,
  Target,
} from "lucide-react";

function SummaryCards({ totals }) {

  const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

  const cards = [
    {
      title: "Available Balance",
      value: totals.balance,
      icon: WalletCards,
      iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-500/10",
      trend: "+12.5%",
      trendPositive: true,
    },
    {
      title: "Total Income",
      value: totals.income,
      icon: TrendingUp,
      iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10",
      trend: "+8.2%",
      trendPositive: true,
    },
    {
      title: "Total Expenses",
      value: totals.expense,
      icon: TrendingDown,
      iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-500/10",
      trend: "-3.4%",
      trendPositive: false,
    },
    {
      title: "Savings Rate",
      value: `${totals.savingsPercentage}%`,
      icon: Target,
      iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-500/10",
      trend: "Goal 40%",
      trendPositive: true,
      isCurrency: false,
    },
  ];

  return (
    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass-card rounded-3xl p-5 shadow-soft"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.iconClass}`}
              >
                <Icon size={22} />
              </div>

              <button
                type="button"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MoreHorizontal size={19} />
              </button>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
              {card.title}
            </p>

            <p className="mt-1 text-2xl font-extrabold">
              {card.isCurrency === false
                ? card.value
                : formatCurrency(card.value)}
            </p>

            <div className="mt-4 flex items-center gap-2 text-xs">
              <span
                className={`flex items-center gap-1 rounded-full px-2 py-1 font-bold ${
                  card.trendPositive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                }`}
              >
                {card.trendPositive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}

                {card.trend}
              </span>

              <span className="text-slate-400">from last month</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default SummaryCards;