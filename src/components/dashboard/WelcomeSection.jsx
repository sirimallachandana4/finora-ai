import { CircleDollarSign } from "lucide-react";

function WelcomeSection({ openForm }) {
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <p className="text-sm font-semibold text-violet-600">
          Friday, 31 July 2026
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
          Welcome Back 👋
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Track your financial health with real-time insights and smart analytics.
        </p>
      </div>

      <button
        type="button"
        onClick={openForm}
        className="flex w-fit items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900"
      >
        <CircleDollarSign size={19} />
        Record new transaction
      </button>
    </div>
  );
}

export default WelcomeSection;