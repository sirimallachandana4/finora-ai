import { useState } from "react";
import { Bot, Send, X, Sparkles } from "lucide-react";

function FinancialAssistant({
  transactions = [],
  totals = {},
  financialInsight = "",
  predictedMonthlyExpense = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text: "Hi! I'm your Finora AI assistant. Ask me about your income, expenses, spending, savings or financial goals.",
    },
  ]);

  /* =========================================================
     SAFE FINANCIAL VALUES
  ======================M=================================== */

  const income = Number(totals.income) || 0;
  const expense = Number(totals.expense) || 0;
  const balance = Number(totals.balance) || 0;
  const savingsPercentage = Number(totals.savingsPercentage) || 0;

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);

  /* =========================================================
     CATEGORY EXPENSE
  ========================================================= */

  const getCategoryExpense = (category) => {
    const total = transactions
      .filter(
        (transaction) =>
          transaction.type === "expense" &&
          String(transaction.category || "").toLowerCase() ===
            category.toLowerCase()
      )
      .reduce(
        (sum, transaction) =>
          sum + Number(transaction.amount || 0),
        0
      );

    if (total === 0) {
      return `You currently have no recorded expenses in the ${category} category.`;
    }

    return `You have spent ${formatCurrency(total)} on ${category}.`;
  };

  /* =========================================================
     CATEGORY DETECTION
  ========================================================= */

  const detectCategory = (text) => {
    const categoryKeywords = {
      Food: [
        "food",
        "restaurant",
        "swiggy",
        "zomato",
        "pizza",
        "burger",
        "lunch",
        "dinner",
        "breakfast",
      ],

      Travel: [
        "travel",
        "uber",
        "ola",
        "fuel",
        "petrol",
        "diesel",
        "bus",
        "train",
        "flight",
      ],

      Shopping: [
        "shopping",
        "amazon",
        "flipkart",
        "myntra",
        "meesho",
        "clothes",
        "shoes",
        "dress",
        "mall",
      ],

      Bills: [
        "bill",
        "bills",
        "electricity",
        "internet",
        "recharge",
        "mobile bill",
        "phone bill",
        "water bill",
      ],

      Health: [
        "health",
        "medical",
        "medicine",
        "doctor",
        "hospital",
        "pharmacy",
      ],

      Education: [
        "education",
        "college",
        "school",
        "course",
        "exam",
        "books",
      ],

      Entertainment: [
        "entertainment",
        "movie",
        "cinema",
        "netflix",
        "spotify",
        "game",
        "gaming",
      ],
    };

    for (const [category, keywords] of Object.entries(
      categoryKeywords
    )) {
      if (
        keywords.some((keyword) =>
          text.includes(keyword)
        )
      ) {
        return category;
      }
    }

    return null;
  };

  /* =========================================================
     TOP SPENDING CATEGORY
  ========================================================= */

  const getHighestSpendingCategory = () => {
    const categoryTotals = {};

    transactions.forEach((transaction) => {
      if (transaction.type !== "expense") {
        return;
      }

      const category = transaction.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(transaction.amount || 0);
    });

    const entries = Object.entries(categoryTotals);

    if (entries.length === 0) {
      return "You don't have any recorded expenses yet.";
    }

    entries.sort((a, b) => b[1] - a[1]);

    const [category, amount] = entries[0];

    return `Your highest spending category is ${category}, with ${formatCurrency(
      amount
    )} spent.`;
  };

  /* =========================================================
     HIGHEST INDIVIDUAL EXPENSE
  ========================================================= */

  const getHighestExpense = () => {
    const expenses = transactions.filter(
      (transaction) => transaction.type === "expense"
    );

    if (expenses.length === 0) {
      return "You don't have any expense transactions yet.";
    }

    const highestExpense = [...expenses].sort(
      (a, b) =>
        Number(b.amount || 0) -
        Number(a.amount || 0)
    )[0];

    return `Your highest expense is ${formatCurrency(
      highestExpense.amount
    )} for ${
      highestExpense.title || "an expense"
    } in the ${
      highestExpense.category || "Other"
    } category.`;
  };

  /* =========================================================
     TRANSACTION COUNT
  ========================================================= */

  const getTransactionCount = () => {
    return `You currently have ${
      transactions.length
    } recorded transaction${
      transactions.length === 1 ? "" : "s"
    }.`;
  };

  /* =========================================================
     FINANCIAL ADVICE
  ========================================================= */

const getSavingsAdvice = () => {
  if (income === 0) {
    return "Add your income transactions first so I can give you personalized savings recommendations.";
  }

  const expenseRatio = (expense / income) * 100;

  if (expenseRatio > 80) {
    return `Your expenses are around ${Math.round(
      expenseRatio
    )}% of your income. Try reducing non-essential spending and gradually increasing your savings.`;
  }

  if (expenseRatio > 60) {
    return `Your spending is moderately high at around ${Math.round(
      expenseRatio
    )}% of your income. Review optional expenses and try to save money before spending on non-essential items.`;
  }

  return `Your spending is currently around ${Math.round(
    expenseRatio
  )}% of your income. Keep tracking your expenses and continue building your savings. Your current savings rate is ${savingsPercentage}%.`;
};
  /* =========================================================
     SAVINGS ADVICE
  ========================================================= */
  

  /* =========================================================
     AI RESPONSE
  ========================================================= */

  const generateResponse = (question) => {
    const text = question.trim().toLowerCase();

    /* EMPTY QUESTION */

    if (!text) {
      return "Please ask me a financial question.";
    }

    /* GREETING */

    if (
      text === "hi" ||
      text === "hello" ||
      text === "hey" ||
      text.includes("good morning") ||
      text.includes("good afternoon") ||
      text.includes("good evening")
    ) {
      return "Hi! 👋 I'm your Finora AI assistant. You can ask me about your balance, income, expenses, savings, or spending categories.";
    }

    /* THANK YOU */

    if (
      text.includes("thank") ||
      text.includes("thanks") ||
      text === "ok" ||
      text === "okay" ||
      text.includes("great") ||
      text.includes("nice")
    ) {
      return "You're welcome! 😊 I'm here whenever you want to check your finances or get a spending suggestion.";
    }

    /* HELP */

    if (
      text.includes("help") ||
      text.includes("what can you do")
    ) {
      return "You can ask me things like: What is my balance? How much did I spend? How much did I spend on food? What is my income? What is my savings rate? What did I spend the most on? Give me financial advice.";
    }

    /* =======================================================
       ADVICE / SUGGESTIONS
    ======================================================= */

    if (
      text.includes("advice") ||
      text.includes("suggestion") ||
      text.includes("suggest") ||
      text.includes("recommend") ||
      text.includes("improve") ||
      text.includes("financially healthy") ||
      text.includes("financial tip") ||
      text.includes("what should i do") ||
      text.includes("how can i save") ||
      text.includes("how to save")
    ) {
      return getSavingsAdvice();
    }

    /* =======================================================
       CATEGORY QUESTIONS
    ======================================================= */

    const detectedCategory = detectCategory(text);

    if (
      detectedCategory &&
      (
        text.includes("spent") ||
        text.includes("spending") ||
        text.includes("expense") ||
        text.includes("expenses") ||
        text.includes("how much") ||
        text.includes("cost")
      )
    ) {
      return getCategoryExpense(detectedCategory);
    }

    /* =======================================================
       HIGHEST SPENDING CATEGORY
    ======================================================= */

    if (
      (
        text.includes("most") ||
        text.includes("highest") ||
        text.includes("biggest")
      ) &&
      (
        text.includes("spent") ||
        text.includes("spending") ||
        text.includes("expense")
      )
    ) {
      return getHighestSpendingCategory();
    }

    /* =======================================================
       HIGHEST INDIVIDUAL EXPENSE
    ======================================================= */

    if (
      text.includes("highest expense") ||
      text.includes("biggest expense") ||
      text.includes("most expensive")
    ) {
      return getHighestExpense();
    }

    /* =======================================================
       BALANCE
    ======================================================= */

    if (
      text.includes("balance") ||
      text.includes("money left") ||
      text.includes("how much money do i have")
    ) {
      return `Your current balance is ${formatCurrency(
        balance
      )}.`;
    }

    /* =======================================================
       INCOME
    ======================================================= */

    if (
      text.includes("income") ||
      text.includes("salary") ||
      text.includes("earned") ||
      text.includes("earnings")
    ) {
      return `Your total recorded income is ${formatCurrency(
        income
      )}.`;
    }

    /* =======================================================
       SAVINGS
    ======================================================= */

    if (
      text.includes("saving") ||
      text.includes("save") ||
      text.includes("savings rate")
    ) {
      return `Your current savings rate is ${savingsPercentage}%. ${financialInsight}`;
    }

    /* =======================================================
       PREDICTED EXPENSE
    ======================================================= */

    if (
      text.includes("predict") ||
      text.includes("forecast") ||
      text.includes("expected expense") ||
      text.includes("monthly expense")
    ) {
      return `Based on your current spending pattern, your predicted monthly expense is approximately ${formatCurrency(
        predictedMonthlyExpense
      )}.`;
    }

    /* =======================================================
       EXPENSE QUESTIONS
    ======================================================= */

    if (
      text.includes("expense") ||
      text.includes("spent") ||
      text.includes("spending")
    ) {
      const expenseRatio =
        income > 0
          ? (expense / income) * 100
          : 0;

      /* Spending health */

      if (
        text.includes("good") ||
        text.includes("efficient") ||
        text.includes("okay") ||
        text.includes("ok") ||
        text.includes("reduce") ||
        text.includes("too much") ||
        text.includes("healthy")
      ) {
        if (income === 0) {
          return "I need your income data to determine whether your current spending level is healthy.";
        }

        if (expenseRatio <= 40) {
          return `Your expenses are ${Math.round(
            expenseRatio
          )}% of your income. Your spending is currently under good control. You are saving ${savingsPercentage}% of your income.`;
        }

        if (expenseRatio <= 70) {
          return `Your expenses are ${Math.round(
            expenseRatio
          )}% of your income. Your spending is moderate, but you could improve your savings by reducing non-essential expenses.`;
        }

        return `Your expenses are ${Math.round(
          expenseRatio
        )}% of your income, which is relatively high. Consider reducing non-essential spending and setting a monthly spending limit.`;
      }

      /* General spending */

      return `You have spent ${formatCurrency(
        expense
      )} so far. Your predicted monthly expense is approximately ${formatCurrency(
        predictedMonthlyExpense
      )}.`;
    }

    /* =======================================================
       TRANSACTION COUNT
    ======================================================= */

    if (
      text.includes("how many transactions") ||
      text.includes("number of transactions") ||
      text === "transactions"
    ) {
      return getTransactionCount();
    }

    /* =======================================================
       BUDGET
    ======================================================= */

    if (
      text.includes("budget") ||
      text.includes("control my spending")
    ) {
      return `Your current recorded expenses are ${formatCurrency(
        expense
      )}. ${financialInsight}`;
    }

    /* =======================================================
       FALLBACK
    ======================================================= */

    return `I can help you analyze your Finora data. Your current balance is ${formatCurrency(
      balance
    )}, total income is ${formatCurrency(
      income
    )}, and total expenses are ${formatCurrency(
      expense
    )}. Try asking me about a specific category, your savings, or your highest spending.`;
  };

  /* =========================================================
     SEND MESSAGE
  ========================================================= */

  const handleSend = () => {
    const question = input.trim();

    if (!question) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: question,
    };

    const assistantMessage = {
      id: Date.now() + 1,
      role: "assistant",
      text: generateResponse(question),
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  };

  /* =========================================================
     ENTER KEY
  ========================================================= */

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  /* =========================================================
     QUICK QUESTION
  ========================================================= */

  const askQuickQuestion = (question) => {
    setInput(question);
  };

  /* =========================================================
     UI
  ========================================================= */

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 text-white shadow-xl transition hover:scale-105 hover:bg-violet-700"
          title="Open Finora AI"
        >
          <Bot size={25} />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

          {/* HEADER */}

          <div className="flex items-center justify-between bg-violet-600 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/20">
                <Sparkles size={20} />
              </div>

              <div>
                <h3 className="font-extrabold">
                  Finora AI
                </h3>

                <p className="text-xs text-violet-100">
                  Financial Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl p-2 transition hover:bg-white/10"
              title="Close Finora AI"
            >
              <X size={20} />
            </button>
          </div>

          {/* MESSAGES */}

          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-violet-600 text-white"
                      : "rounded-bl-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* QUICK QUESTIONS */}

          <div className="flex gap-2 overflow-x-auto px-4 pb-3">
            <button
              type="button"
              onClick={() =>
                askQuickQuestion(
                  "How much did I spend?"
                )
              }
              className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold dark:border-slate-700"
            >
              My spending
            </button>

            <button
              type="button"
              onClick={() =>
                askQuickQuestion(
                  "What is my balance?"
                )
              }
              className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold dark:border-slate-700"
            >
              My balance
            </button>

            <button
              type="button"
              onClick={() =>
                askQuickQuestion(
                  "How much did I spend on food?"
                )
              }
              className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold dark:border-slate-700"
            >
              Food
            </button>
          </div>

          {/* INPUT */}

          <div className="border-t border-slate-200 p-3 dark:border-slate-800">
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask Finora AI..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              />

              <button
                type="button"
                onClick={handleSend}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white transition hover:bg-violet-700"
                title="Send message"
              >
                <Send size={17} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FinancialAssistant;