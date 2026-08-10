import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import formatCurrency from "./utils/formatCurrency";

import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";

import WelcomeSection from "./components/dashboard/WelcomeSection";
import SummaryCards from "./components/dashboard/SummaryCards";
import BudgetCard from "./components/dashboard/BudgetCard";
import FinancialOverview from "./components/dashboard/FinancialOverview";
import AiInsight from "./components/dashboard/AiInsight";
import CategoryChart from "./components/dashboard/CategoryChart";
import FinancialAssistant from "./components/ai/FinancialAssistant";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth, db } from "./firebase";
import UsernameModal from "./components/auth/UsernameModal";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";


import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import TransactionModal from "./components/transactions/TransactionModal";
import TransactionsTable from "./components/transactions/TransactionsTable";

import TransactionsPage from "./components/pages/TransactionsPage";

/* =========================================================
   CATEGORY COLORS
========================================================= */

const categoryColors = {
  Food: "#f97316",
  Travel: "#3b82f6",
  Shopping: "#a855f7",
  Bills: "#ef4444",
  Health: "#14b8a6",
  Education: "#6366f1",
  Entertainment: "#ec4899",
  Salary: "#22c55e",
  Freelance: "#8b5cf6",
  Other: "#64748b",
};


/* =========================================================
   ANALYTICS PAGE
   OUTSIDE APP
========================================================= */

function AnalyticsPage({
  chartData,
  categoryData,
  totalExpense,
  totals,
  financialInsight,
  predictedMonthlyExpense,
}) {
  return (
    <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          Analytics
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Understand your income, spending and financial performance.
        </p>
      </div>

      {/* Summary */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Income
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-emerald-500">
            {formatCurrency(totals.income)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Expenses
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-rose-500">
            {formatCurrency(totals.expense)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Current Balance
          </p>

          <h2
            className={`mt-2 text-2xl font-extrabold ${
              totals.balance >= 0
                ? "text-violet-500"
                : "text-rose-500"
            }`}
          >
            {formatCurrency(totals.balance)}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Savings Rate
          </p>

          <h2 className="mt-2 text-2xl font-extrabold text-blue-500">
            {totals.savingsPercentage}%
          </h2>
        </div>
      </div>

      {/* Charts */}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <FinancialOverview data={chartData} />

        <CategoryChart
          data={categoryData}
          totalExpense={totalExpense}
        />
      </div>

      {/* AI Insight */}

      <div className="mt-6">
        <AiInsight
          insight={financialInsight}
          predictedExpense={predictedMonthlyExpense}
          savingsPercentage={totals.savingsPercentage}
        />
      </div>
    </div>
  );
}

/* =========================================================
   SAVINGS GOALS PAGE
   OUTSIDE APP
========================================================= */

function GoalsPage({
  monthlyBudget,
  setMonthlyBudget,
  remainingBudget,
  budgetPercentage,
  expense,
  totals,
  currentUser,
}) {
  const progress = Math.min(
    Math.max(budgetPercentage, 0),
    100
  );

  return (
    <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold sm:text-3xl">
          Savings Goals
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Track your monthly budget and work toward your savings target.
        </p>
      </div>

      {/* Goal Card */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Monthly savings goal
            </p>

            <h2 className="mt-1 text-3xl font-extrabold">
              {formatCurrency(monthlyBudget)}
            </h2>
          </div>

          <div className="rounded-2xl bg-violet-50 px-5 py-4 dark:bg-violet-500/10">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Current balance
            </p>

            <p className="mt-1 text-xl font-extrabold text-violet-600 dark:text-violet-400">
              {formatCurrency(totals.balance)}
            </p>
          </div>
        </div>

        {/* Progress */}

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold">
              Budget usage
            </span>

            <span className="font-bold text-violet-600">
              {Math.round(progress)}%
            </span>
          </div>

          <div className="h-4 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-violet-600 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {/* Statistics */}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Monthly budget
            </p>

            <p className="mt-1 text-lg font-bold">
              {formatCurrency(monthlyBudget)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Total spent
            </p>

            <p className="mt-1 text-lg font-bold text-rose-500">
              {formatCurrency(expense)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Remaining
            </p>

            <p
              className={`mt-1 text-lg font-bold ${
                remainingBudget >= 0
                  ? "text-emerald-500"
                  : "text-rose-500"
              }`}
            >
              {formatCurrency(remainingBudget)}
            </p>
          </div>
        </div>

        {/* Budget Input */}

        <div className="mt-8 max-w-md">
          <label
            htmlFor="monthly-budget"
            className="text-sm font-bold"
          >
            Update monthly savings/budget target
          </label>

          <input
            id="monthly-budget"
            type="number"
            min="0"
            value={monthlyBudget}
            onChange={async (event) => {
  const value = Number(event.target.value);

  setMonthlyBudget(value);

  if (!currentUser) {
    return;
  }

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        monthlyBudget: value,
      },
      {
        merge: true,
      }
    );
  } catch (error) {
    console.error(
      "Error saving budget:",
      error
    );
  }
}}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
      </div>

      {/* Tip */}

      <div className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-500/20 dark:bg-violet-500/10">
        <h3 className="text-lg font-extrabold">
          💡 Savings tip
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Try to keep unnecessary expenses under control
          and move a fixed portion of your income toward
          your savings goal every month.
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

function App() {
  /* =======================================================
     TRANSACTIONS
  ======================================================= */

const [currentUser, setCurrentUser] = useState(null);
const [authLoading, setAuthLoading] = useState(true);
const [showSignup, setShowSignup] = useState(false);
const [showUsernameModal, setShowUsernameModal] = useState(false);
const [usernameLoading, setUsernameLoading] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(
    auth,
    async (user) => {
      if (!user) {
        setCurrentUser(null);
        setShowUsernameModal(false);
        setAuthLoading(false);
        return;
      }

      try {
        const userRef = doc(
          db,
          "users",
          user.uid
        );

        const userSnapshot = await getDoc(
          userRef
        );

        if (userSnapshot.exists()) {
          const userData =
            userSnapshot.data();

          const username =
            userData.username ||
            user.displayName ||
            user.email?.split("@")[0] ||
            "";

          setCurrentUser({
            ...user,
            username: username,
          });

          if (!userData.username) {
            setShowUsernameModal(true);
          }
        } else {
          setCurrentUser({
            ...user,
            username: "",
          });

          setShowUsernameModal(true);
        }
      } catch (error) {
        console.error(
          "Error loading user profile:",
          error
        );

        setCurrentUser(user);
      }

      setAuthLoading(false);
    }
  );

  return () => unsubscribe();
}, []);

const handleLogout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Logout error:", error);
  }
};

const handleUsernameSubmit = async (username) => {
  if (!currentUser) {
    return;
  }

  setUsernameLoading(true);

  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        username: username,
      },
      {
        merge: true,
      }
    );

    setCurrentUser((previousUser) => ({
      ...previousUser,
      username: username,
      displayName: username,
    }));

    setShowUsernameModal(false);
  } catch (error) {
    console.error(
      "Error saving username:",
      error
    );
  } finally {
    setUsernameLoading(false);
  }
};
  
  const [transactions, setTransactions] = useState([]);

useEffect(() => {
  if (!currentUser) {
    return;
  }

  const transactionsRef = collection(
    db,
    "users",
    currentUser.uid,
    "transactions"
  );

  const transactionsQuery = query(
    transactionsRef,
    orderBy("date", "desc")
  );

  const unsubscribe = onSnapshot(
    transactionsQuery,
    (snapshot) => {
      const userTransactions = snapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data(),
        })
      );

      setTransactions(userTransactions);
    },
    (error) => {
      console.error(
        "Error loading transactions:",
        error
      );
    }
  );

  return () => unsubscribe();
}, [currentUser]);

  /* =======================================================
     NOTIFICATIONS
  ======================================================= */

  const [notifications, setNotifications] =
    useState([
      {
        id: 1,
        type: "success",
        message: "Welcome to Finora AI.",
        read: false,
      },
    ]);

  /* =======================================================
     THEME
  ======================================================= */

  const [isDarkMode, setIsDarkMode] =
    useState(() => {
      return (
        localStorage.getItem(
          "finance-theme"
        ) === "dark"
      );
    });

  useEffect(() => {
    localStorage.setItem(
      "finance-theme",
      isDarkMode ? "dark" : "light"
    );

    document.documentElement.classList.toggle(
      "dark",
      isDarkMode
    );
  }, [isDarkMode]);

  /* =======================================================
     SIDEBAR
  ======================================================= */

  const [isSidebarOpen, setIsSidebarOpen] =
    useState(true);

  /* =======================================================
     ACTIVE PAGE
  ======================================================= */

  const [activePage, setActivePage] =
    useState("dashboard");

  /* =======================================================
     TRANSACTION MODAL
  ======================================================= */

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: new Date()
      .toISOString()
      .split("T")[0],
  });

  const titleInputRef = useRef(null);

  /* =======================================================
   BUDGET
======================================================= */

const [monthlyBudget, setMonthlyBudget] = useState(50000);

/* =======================================================
   LOAD USER BUDGET FROM FIREBASE
======================================================= */

useEffect(() => {
  if (!currentUser) {
    return;
  }

  const userRef = doc(
    db,
    "users",
    currentUser.uid
  );

  const unsubscribe = onSnapshot(
    userRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();

        setMonthlyBudget(
          Number(data.monthlyBudget ?? 50000)
        );
      }
    },
    (error) => {
      console.error(
        "Error loading budget:",
        error
      );
    }
  );

  return () => unsubscribe();
}, [currentUser]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const [searchText, setSearchText] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  /* =======================================================
     SAVE BUDGET
  ======================================================= */


  /* =======================================================
     SAVE TRANSACTIONS
  ======================================================= */


  /* =======================================================
     FOCUS MODAL INPUT
  ======================================================= */

  useEffect(() => {
    if (!isFormOpen) {
      return;
    }

    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [isFormOpen]);

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      type: "expense",
      category: "Food",
      date: new Date()
        .toISOString()
        .split("T")[0],
    });

    setEditingTransaction(null);
  };

  /* =======================================================
     EDIT TRANSACTION
  ======================================================= */

  const handleEditTransaction = (
    transaction
  ) => {
    setEditingTransaction(transaction);

    setFormData({
      title: transaction.title || "",
      amount: transaction.amount || "",
      type:
        transaction.type || "expense",
      category:
        transaction.category || "Other",
      date:
        transaction.date ||
        new Date()
          .toISOString()
          .split("T")[0],
    });

    setIsFormOpen(true);
  };

  /* =======================================================
     ADD / UPDATE TRANSACTION
  ======================================================= */

  const handleAddTransaction = async (event) => {
  event.preventDefault();

  if (!currentUser) {
    return;
  }

  const title = String(formData.title || "").trim();
  const amount = Number(formData.amount);

  if (!title || !amount || amount <= 0) {
    return;
  }

  try {
    const transactionsRef = collection(
      db,
      "users",
      currentUser.uid,
      "transactions"
    );

    // ADD
    if (!editingTransaction) {
      await addDoc(transactionsRef, {
        title,
        amount,
        type: formData.type || "expense",
        category: formData.category || "Other",
        date: formData.date,
        createdAt: serverTimestamp(),
      });

      setNotifications((previous) => [
        {
          id: Date.now(),
          type: "success",
          message: `${
            formData.type === "income" ? "Income" : "Expense"
          } added successfully.`,
          read: false,
        },
        ...previous,
      ]);
    }

    // UPDATE
    else {
      const transactionRef = doc(
        db,
        "users",
        currentUser.uid,
        "transactions",
        editingTransaction.id
      );

      await updateDoc(transactionRef, {
        title,
        amount,
        type: formData.type || "expense",
        category: formData.category || "Other",
        date: formData.date,
      });

      setNotifications((previous) => [
        {
          id: Date.now(),
          type: "success",
          message: "Transaction updated successfully.",
          read: false,
        },
        ...previous,
      ]);
    }

    resetForm();
    setIsFormOpen(false);

  } catch (error) {
    console.error("Transaction error:", error);

    setNotifications((previous) => [
      {
        id: Date.now(),
        type: "error",
        message: "Unable to save transaction.",
        read: false,
      },
      ...previous,
    ]);
  }
};

  /* =======================================================
     SMART CATEGORY DETECTION
  ======================================================= */

  const handleInputChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    /* IMPORTANT:
       Category, amount, date and type
       are directly controlled here.
    */

    if (name !== "title") {
      setFormData((previous) => ({
        ...previous,
        [name]: value,
      }));

      return;
    }

    const title =
      value.toLowerCase().trim();

    let suggestedCategory = "";

    /* FOOD */

    if (
      title.includes("swiggy") ||
      title.includes("zomato") ||
      title.includes("restaurant") ||
      title.includes("food") ||
      title.includes("pizza") ||
      title.includes("burger") ||
      title.includes("lunch") ||
      title.includes("dinner") ||
      title.includes("breakfast") ||
      title.includes("hotel") ||
      title.includes("cafe")
    ) {
      suggestedCategory = "Food";
    }

    /* TRAVEL */

    else if (
      title.includes("uber") ||
      title.includes("ola") ||
      title.includes("fuel") ||
      title.includes("petrol") ||
      title.includes("diesel") ||
      title.includes("bus") ||
      title.includes("train") ||
      title.includes("flight") ||
      title.includes("travel") ||
      title.includes("metro")
    ) {
      suggestedCategory = "Travel";
    }

    /* SHOPPING */

    else if (
      title.includes("amazon") ||
      title.includes("flipkart") ||
      title.includes("meesho") ||
      title.includes("myntra") ||
      title.includes("shopping") ||
      title.includes("clothes") ||
      title.includes("shoes") ||
      title.includes("dress") ||
      title.includes("mall")
    ) {
      suggestedCategory = "Shopping";
    }

    /* BILLS */

    else if (
      title.includes("electricity") ||
      title.includes("internet") ||
      title.includes("recharge") ||
      title.includes("mobile bill") ||
      title.includes("phone bill") ||
      title.includes("water bill") ||
      title.includes("gas bill") ||
      title.includes("bill")
    ) {
      suggestedCategory = "Bills";
    }

    /* HEALTH */

    else if (
      title.includes("hospital") ||
      title.includes("doctor") ||
      title.includes("medicine") ||
      title.includes("medical") ||
      title.includes("pharmacy") ||
      title.includes("health")
    ) {
      suggestedCategory = "Health";
    }

    /* EDUCATION */

    else if (
      title.includes("college") ||
      title.includes("school") ||
      title.includes("course") ||
      title.includes("education") ||
      title.includes("exam") ||
      title.includes("book") ||
      title.includes("tuition")
    ) {
      suggestedCategory = "Education";
    }

    /* ENTERTAINMENT */

    else if (
      title.includes("movie") ||
      title.includes("cinema") ||
      title.includes("netflix") ||
      title.includes("spotify") ||
      title.includes("game") ||
      title.includes("entertainment") ||
      title.includes("concert")
    ) {
      suggestedCategory =
        "Entertainment";
    }

    /* SALARY */

    else if (
      title.includes("salary") ||
      title.includes("income") ||
      title.includes("paycheck")
    ) {
      suggestedCategory = "Salary";
    }

    /* FREELANCE */

    else if (
      title.includes("freelance") ||
      title.includes("client") ||
      title.includes("project payment") ||
      title.includes("website project")
    ) {
      suggestedCategory = "Freelance";
    }

    setFormData((previous) => ({
      ...previous,
      title: value,

      ...(suggestedCategory
        ? {
            category:
              suggestedCategory,
          }
        : {}),
    }));
  };

  /* =======================================================
     DELETE TRANSACTION
  ======================================================= */

  const deleteTransaction = async (transactionId) => {
  const shouldDelete = window.confirm(
    "Are you sure you want to delete this transaction?"
  );

  if (!shouldDelete || !currentUser) {
    return;
  }

  try {
    const transactionRef = doc(
      db,
      "users",
      currentUser.uid,
      "transactions",
      transactionId
    );

    await deleteDoc(transactionRef);

    setNotifications((previous) => [
      {
        id: Date.now(),
        type: "warning",
        message: "Transaction deleted.",
        read: false,
      },
      ...previous,
    ]);
  } catch (error) {
    console.error("Delete transaction error:", error);

    setNotifications((previous) => [
      {
        id: Date.now(),
        type: "error",
        message: "Unable to delete transaction.",
        read: false,
      },
      ...previous,
    ]);
  }
};

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  const exportToCSV = () => {
    const headings = [
      "Title",
      "Amount",
      "Type",
      "Category",
      "Date",
    ];

    const rows = transactions.map(
      (transaction) => [
        transaction.title,
        transaction.amount,
        transaction.type,
        transaction.category,
        transaction.date,
      ]
    );

    const csvContent = [
      headings,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value
              ).replaceAll(
                '"',
                '""'
              )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const downloadLink =
      document.createElement("a");

    downloadLink.href = url;

    downloadLink.download =
      "finance-transactions.csv";

    document.body.appendChild(
      downloadLink
    );

    downloadLink.click();

    document.body.removeChild(
      downloadLink
    );

    URL.revokeObjectURL(url);
  };

  /* =======================================================
     TOTALS
  ======================================================= */

  const totals = useMemo(() => {
    const income = transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount
          ),
        0
      );

    const expense = transactions
      .filter(
        (transaction) =>
          transaction.type ===
          "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          Number(
            transaction.amount
          ),
        0
      );

    return {
      income,
      expense,
      balance:
        income - expense,
      savingsPercentage:
        income > 0
          ? Math.round(
              ((income - expense) /
                income) *
                100
            )
          : 0,
    };
  }, [transactions]);

  /* =======================================================
     BUDGET
  ======================================================= */

  const remainingBudget =
    monthlyBudget -
    totals.expense;

  const budgetPercentage =
    monthlyBudget > 0
      ? Math.min(
          (totals.expense /
            monthlyBudget) *
            100,
          100
        )
      : 0;

  /* =======================================================
     MONTHLY CHART
  ======================================================= */

  const currentMonthChartData = useMemo(() => {
  const today = new Date();
  const months = [];

  // Create the last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    );

    months.push({
      month: date.toLocaleString("en-US", {
        month: "short",
      }),
      monthNumber: date.getMonth(),
      year: date.getFullYear(),
      income: 0,
      expense: 0,
    });
  }

  // Add the user's actual transactions
  transactions.forEach((transaction) => {
    if (!transaction.date) return;

    const transactionDate = new Date(
      transaction.date
    );

    const transactionMonth =
      transactionDate.getMonth();

    const transactionYear =
      transactionDate.getFullYear();

    const monthData = months.find(
      (month) =>
        month.monthNumber === transactionMonth &&
        month.year === transactionYear
    );

    if (!monthData) return;

    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      monthData.income += amount;
    }

    if (transaction.type === "expense") {
      monthData.expense += amount;
    }
  });

  return months.map((month) => ({
    month: month.month,
    income: month.income,
    expense: month.expense,
  }));
}, [transactions]);
  /* =======================================================
     CATEGORY DATA
  ======================================================= */

  const expenseCategoryData =
    useMemo(() => {
      const categoryTotals = {};

      transactions.forEach(
        (transaction) => {
          if (
            transaction.type ===
            "expense"
          ) {
            const category =
              transaction.category ||
              "Other";

            categoryTotals[
              category
            ] =
              (categoryTotals[
                category
              ] || 0) +
              Number(
                transaction.amount
              );
          }
        }
      );

      return Object.keys(
        categoryTotals
      ).map((category) => ({
        name: category,
        value:
          categoryTotals[
            category
          ],
        color:
          categoryColors[
            category
          ] || "#8b5cf6",
      }));
    }, [transactions]);

  /* =======================================================
     FILTERED TRANSACTIONS
  ======================================================= */

  const filteredTransactions =
    useMemo(() => {
      const search =
        searchText
          .toLowerCase()
          .trim();

      return transactions
        .filter((transaction) => {
          const title =
            transaction.title ||
            "";

          const category =
            transaction.category ||
            "";

          const matchesSearch =
            title
              .toLowerCase()
              .includes(search) ||
            category
              .toLowerCase()
              .includes(search);

          const matchesCategory =
            categoryFilter ===
              "All" ||
            category ===
              categoryFilter;

          return (
            matchesSearch &&
            matchesCategory
          );
        })
        .sort(
          (a, b) =>
            new Date(b.date) -
            new Date(a.date)
        );
    }, [
      transactions,
      searchText,
      categoryFilter,
    ]);

  /* =======================================================
     FINANCIAL INSIGHT
  ======================================================= */

  const financialInsight =
    useMemo(() => {
      if (totals.income === 0) {
        return "Add an income transaction to start receiving financial insights.";
      }

      const expenseRatio =
        (totals.expense /
          totals.income) *
        100;

      if (expenseRatio <= 40) {
        return `Excellent! You are saving ${totals.savingsPercentage}% of your income this month.`;
      }

      if (expenseRatio <= 70) {
        return "Your spending is under control. Try to increase savings by reducing optional expenses.";
      }

      return `Your expenses are ${Math.round(
        expenseRatio
      )}% of your income. Consider reducing shopping and entertainment costs.`;
    }, [totals]);

  /* =======================================================
     PREDICTED EXPENSE
  ======================================================= */

  const predictedMonthlyExpense =
    useMemo(() => {
      const currentDate =
        new Date();

      const currentDay =
        Math.max(
          currentDate.getDate(),
          1
        );

      const daysInMonth =
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() +
            1,
          0
        ).getDate();

      return Math.round(
        (totals.expense /
          currentDay) *
          daysInMonth
      );
    }, [totals.expense]);

  /* =======================================================
     PAGE RENDERING
  ======================================================= */

  const renderPage = () => {
    /* DASHBOARD */

    if (
      activePage ===
      "dashboard"
    ) {

      return (
        <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          <WelcomeSection
            openForm={() => {
              resetForm();
              setIsFormOpen(true);
            }}
          />

          <SummaryCards
            totals={totals}
            formatCurrency={
              formatCurrency
            }
          />

          <BudgetCard
            monthlyBudget={
              monthlyBudget
            }
            setMonthlyBudget={
              setMonthlyBudget
            }
            remainingBudget={
              remainingBudget
            }
            budgetPercentage={
              budgetPercentage
            }
            expense={
              totals.expense
            }
          />

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <FinancialOverview
              data={
                currentMonthChartData
              }
            />

            <AiInsight
              insight={
                financialInsight
              }
              predictedExpense={
                predictedMonthlyExpense
              }
              savingsPercentage={
                totals.savingsPercentage
              }
            />
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.5fr]">
            <CategoryChart
              data={
                expenseCategoryData
              }
              totalExpense={
                totals.expense
              }
            />

            <TransactionsTable
              transactions={
                filteredTransactions
              }
              searchText={
                searchText
              }
              setSearchText={
                setSearchText
              }
              categoryFilter={
                categoryFilter
              }
              setCategoryFilter={
                setCategoryFilter
              }
              deleteTransaction={
                deleteTransaction
              }
              handleEditTransaction={
                handleEditTransaction
              }
              exportToCSV={
                exportToCSV
              }
            />
          </div>
        </div>
      );
    }

    /* TRANSACTIONS */

    if (
      activePage ===
      "transactions"
    ) {
      return (
        <TransactionsPage
          transactions={
            filteredTransactions
          }
          searchText={
            searchText
          }
          setSearchText={
            setSearchText
          }
          categoryFilter={
            categoryFilter
          }
          setCategoryFilter={
            setCategoryFilter
          }
          deleteTransaction={
            deleteTransaction
          }
          handleEditTransaction={
            handleEditTransaction
          }
          exportToCSV={
            exportToCSV
          }
        />
      );
    }

    /* ANALYTICS */

    if (
      activePage ===
      "analytics"
    ) {
      return (
        <AnalyticsPage
          chartData={
            currentMonthChartData
          }
          categoryData={
            expenseCategoryData
          }
          totalExpense={
            totals.expense
          }
          totals={totals}
          financialInsight={
            financialInsight
          }
          predictedMonthlyExpense={
            predictedMonthlyExpense
          }
        />
      );
    }

    /* SAVINGS GOALS */

    if (
      activePage ===
      "goals"
    ) {
      return (
        <GoalsPage
  monthlyBudget={monthlyBudget}
  setMonthlyBudget={setMonthlyBudget}
  remainingBudget={remainingBudget}
  budgetPercentage={budgetPercentage}
  expense={totals.expense}
  totals={totals}
  currentUser={currentUser}
/>
      );
    }

    /* FALLBACK */

    return (
      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <WelcomeSection
          openForm={() => {
            resetForm();
            setIsFormOpen(true);
          }}
        />

        <SummaryCards
          totals={totals}
          formatCurrency={
            formatCurrency
          }
        />
      </div>
    );
  };

  /* =======================================================
   AUTHENTICATION GUARD
======================================================= */

if (authLoading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
      <p className="text-lg font-semibold">
        Loading Finora AI...
      </p>
    </div>
  );
}

if (!currentUser) {
  if (showSignup) {
    return (
      <Signup
        onSignup={(user) => {
          setCurrentUser(user);
          setShowSignup(false);
        }}
        onSwitchToLogin={() => {
          setShowSignup(false);
        }}
      />
    );
  }

  return (
    <Login
      onLogin={(user) => {
        setCurrentUser(user);
      }}
      onSwitchToSignup={() => {
        setShowSignup(true);
      }}
    />
  );
}

/* =======================================================
   MAIN RETURN
======================================================= */

return (
    <div
      className={
        isDarkMode ? "dark" : ""
      }
    >
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-white">
        <div className="flex min-h-screen">

          {/* SIDEBAR */}

          <Sidebar
  currentUser={currentUser}
  activePage={activePage}
            setActivePage={
              setActivePage
            }
            exportToCSV={
              exportToCSV
            }
            isSidebarOpen={
              isSidebarOpen
            }
            setIsSidebarOpen={
              setIsSidebarOpen
            }
          />

          {/* MAIN CONTENT */}

          <main
  className={`min-w-0 flex-1 transition-all duration-300 ${
    isSidebarOpen ? "lg:ml-80" : "lg:ml-0"
  }`}
>

            {/* HEADER */}

            <Header
  currentUser={currentUser}
  isDarkMode={isDarkMode}
              toggleTheme={() =>
                setIsDarkMode(
                  (value) =>
                    !value
                )
              }
              openSidebar={() =>
                setIsSidebarOpen(
                  true
                )
              }
              openForm={() => {
                resetForm();
                setIsFormOpen(
                  true
                );
              }}
              notifications={
                notifications
              }
              setNotifications={
                setNotifications
              }
            />

            <button
  type="button"
  onClick={handleLogout}
  className="rounded-xl bg-rose-500 px-4 py-2 font-bold text-white"
>
  Sign Out
</button>

            {/* ACTIVE PAGE */}

            {renderPage()}
          </main>
        </div>

        <FinancialAssistant
  transactions={transactions}
  totals={totals}
  financialInsight={financialInsight}
  predictedMonthlyExpense={predictedMonthlyExpense}
/>

        {/* TRANSACTION MODAL */}

        <TransactionModal
          isOpen={
            isFormOpen
          }
          closeModal={() => {
            setIsFormOpen(
              false
            );
            resetForm();
          }}
          formData={
            formData
          }
          handleInputChange={
            handleInputChange
          }
          handleSubmit={
            handleAddTransaction
          }
          titleInputRef={
            titleInputRef
          }
          editingTransaction={
            editingTransaction
          }
        />

        <UsernameModal
  isOpen={showUsernameModal}
  onSubmit={handleUsernameSubmit}
  loading={usernameLoading}
/>
      </div>
    </div>
  );
}

export default App;