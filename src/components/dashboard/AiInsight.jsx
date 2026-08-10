import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function AiInsight({
  insight,
  predictedExpense,
  savingsPercentage,
}) {
    const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

  const normalizedProgress = Math.max(
    0,
    Math.min(savingsPercentage, 100)
  );

  return (
    <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 p-6 text-white shadow-xl shadow-violet-500/20">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
          <Sparkles size={23} />
        </div>

        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold">
          AI Powered
        </span>
      </div>

      <h2 className="mt-6 text-xl font-extrabold">
        Smart Financial Insight
      </h2>

      <p className="mt-3 text-sm leading-6 text-violet-100">
        {insight}
      </p>

      <div className="mt-6 rounded-2xl bg-white/10 p-4 backdrop-blur">
        <p className="text-xs font-semibold text-violet-200">
          Predicted month-end spending
        </p>

        <p className="mt-1 text-2xl font-extrabold">
          {formatCurrency(predictedExpense)}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">Savings progress</span>
          <span className="font-bold">{normalizedProgress}%</span>
        </div>

        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/20">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${normalizedProgress}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full bg-white"
          />
        </div>

        <p className="mt-3 text-xs text-violet-200">
          Recommended monthly savings goal: 40%
        </p>
      </div>
    </section>
  );
}

export default AiInsight;