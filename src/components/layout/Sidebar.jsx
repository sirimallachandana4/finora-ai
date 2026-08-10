import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Target,
  Download,
  X,
  WalletCards,
} from "lucide-react";

function Sidebar({
  currentUser,
  activePage,
  setActivePage,
  exportToCSV,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: Receipt,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "goals",
      label: "Savings Goal",
      icon: Target,
    },
  ];

  // ------------------------------------------
  // USERNAME
  // Priority:
  // 1. Firestore username
  // 2. Firebase displayName
  // 3. Email before @
  // 4. User
  // ------------------------------------------

  const username =
    currentUser?.username ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  // First letter for avatar
  const avatarLetter = username.charAt(0).toUpperCase();

  const handleNavigation = (page) => {
    setActivePage(page);

    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-80 flex-col
          bg-slate-950 text-white
          shadow-2xl
          transition-transform duration-300
          ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-7 py-7">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
              <WalletCards size={25} />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              Finora AI
            </h1>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-xl
              bg-slate-800
              text-slate-300
              transition
              hover:bg-slate-700
              hover:text-white
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Profile */}
        <div className="mx-6 mt-6 rounded-3xl bg-slate-900 px-5 py-5">
          <div className="flex items-center gap-4">
            
            {/* Avatar */}
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-xl font-bold text-white">
              {avatarLetter}
            </div>

            {/* User information */}
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-white">
                {username}
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Personal Finance Manager
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-7 flex-1 px-6">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleNavigation(item.id)
                  }
                  className={`
                    flex w-full items-center gap-4
                    rounded-2xl px-5 py-4
                    text-left text-base font-semibold
                    transition-all duration-200

                    ${
                      isActive
                        ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }
                  `}
                >
                  <Icon size={23} />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="mt-10">
            <p className="mb-4 text-sm font-bold text-slate-400">
              Quick Actions
            </p>

            <button
              type="button"
              onClick={exportToCSV}
              className="
                flex w-full items-center justify-center
                gap-3 rounded-2xl
                border border-slate-700
                px-5 py-4
                font-bold text-slate-200
                transition
                hover:bg-slate-900
                hover:text-white
              "
            >
              <Download size={21} />

              Export CSV
            </button>
          </div>
        </nav>

        {/* Tip */}
        <div className="mx-6 mb-6 rounded-2xl bg-slate-900 p-5">
          <div className="flex items-center gap-2">
            <span className="text-xl">💡</span>

            <p className="font-bold">
              Tip of the Day
            </p>
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Keep your expenses categorized to
            understand your spending habits better.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;