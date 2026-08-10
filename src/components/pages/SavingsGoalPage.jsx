import { useEffect, useState } from "react";

function SavingsGoalPage() {
  const [goal, setGoal] = useState(() => {
    return Number(
      localStorage.getItem("finance-savings-goal")
    ) || 100000;
  });

  const [saved, setSaved] = useState(() => {
    return Number(
      localStorage.getItem("finance-saved-amount")
    ) || 0;
  });

  useEffect(() => {
    localStorage.setItem(
      "finance-savings-goal",
      goal
    );
  }, [goal]);

  useEffect(() => {
    localStorage.setItem(
      "finance-saved-amount",
      saved
    );
  }, [saved]);

  const percentage =
    goal > 0
      ? Math.min((saved / goal) * 100, 100)
      : 0;

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold">
        Savings Goal
      </h1>

      <p className="mt-1 text-slate-500 dark:text-slate-400">
        Set a target and track your progress.
      </p>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm dark:bg-slate-900">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold">
              Savings Target
            </label>

            <input
              type="number"
              min="0"
              value={goal}
              onChange={(e) =>
                setGoal(Number(e.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>

          <div>
            <label className="text-sm font-bold">
              Amount Saved
            </label>

            <input
              type="number"
              min="0"
              value={saved}
              onChange={(e) =>
                setSaved(Number(e.target.value))
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex justify-between">
            <span className="font-bold">
              Progress
            </span>

            <span className="font-bold text-violet-500">
              {Math.round(percentage)}%
            </span>
          </div>

          <div className="h-5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <p className="mt-4 text-slate-500">
            ₹{saved.toLocaleString("en-IN")} saved of ₹
            {goal.toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default SavingsGoalPage;