import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Target,
  Download,
  X,
  WalletCards,
  Pencil,
  Check,
  Loader2,
} from "lucide-react";

import {
  doc,
  onSnapshot,
  setDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

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

  /* =====================================================
     USERNAME
     ===================================================== */

  const [username, setUsername] = useState("User");

  const [isEditingUsername, setIsEditingUsername] =
    useState(false);

  const [newUsername, setNewUsername] =
    useState("");

  const [savingUsername, setSavingUsername] =
    useState(false);

  /* =====================================================
     LOAD USERNAME FROM FIRESTORE
     ===================================================== */

  useEffect(() => {
  if (!currentUser?.uid) {
    return undefined;
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
        const userData = snapshot.data();

        if (userData.username) {
          setUsername(userData.username);
          return;
        }
      }

      const fallbackUsername =
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "User";

      setUsername(fallbackUsername);
    },
    (error) => {
      console.error(
        "Error loading username:",
        error
      );

      const fallbackUsername =
        currentUser.displayName ||
        currentUser.email?.split("@")[0] ||
        "User";

      setUsername(fallbackUsername);
    }
  );

  return () => unsubscribe();
}, [currentUser]);

  /* =====================================================
     AVATAR
     ===================================================== */

  const avatarLetter =
    username
      .charAt(0)
      .toUpperCase() || "U";

  /* =====================================================
     START EDITING
     ===================================================== */

  const startEditingUsername = () => {
    setNewUsername(username);
    setIsEditingUsername(true);
  };

  /* =====================================================
     CANCEL EDITING
     ===================================================== */

  const cancelEditingUsername = () => {
    setNewUsername(username);
    setIsEditingUsername(false);
  };

  /* =====================================================
     SAVE USERNAME
     ===================================================== */

  const saveUsername = async () => {
    if (!currentUser) {
      return;
    }

    const trimmedUsername =
      newUsername.trim();

    if (!trimmedUsername) {
      return;
    }

    if (trimmedUsername.length < 3) {
      alert(
        "Username must contain at least 3 characters."
      );
      return;
    }

    if (trimmedUsername.length > 30) {
      alert(
        "Username must contain less than 30 characters."
      );
      return;
    }

    setSavingUsername(true);

    try {
      const userRef = doc(
        db,
        "users",
        currentUser.uid
      );

      await setDoc(
        userRef,
        {
          username:
            trimmedUsername,
        },
        {
          merge: true,
        }
      );

      setUsername(
        trimmedUsername
      );

      setNewUsername(
        trimmedUsername
      );

      setIsEditingUsername(false);
    } catch (error) {
      console.error(
        "Error saving username:",
        error
      );

      alert(
        "Unable to update username. Please try again."
      );
    } finally {
      setSavingUsername(false);
    }
  };

  /* =====================================================
     NAVIGATION
     ===================================================== */

  const handleNavigation = (
    page
  ) => {
    setActivePage(page);

    if (
      window.innerWidth < 1024
    ) {
      setIsSidebarOpen(false);
    }
  };

  /* =====================================================
     RETURN
     ===================================================== */

  return (
    <>
      {/* Mobile backdrop */}

      {isSidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() =>
            setIsSidebarOpen(false)
          }
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
        {/* =================================================
            HEADER
            ================================================= */}

        <div className="flex items-center justify-between border-b border-slate-800 px-7 py-7">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
              <WalletCards
                size={25}
              />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              Finora AI
            </h1>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsSidebarOpen(false)
            }
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

        {/* =================================================
            PROFILE
            ================================================= */}

        <div className="mx-6 mt-6 rounded-3xl bg-slate-900 px-5 py-5">

          <div className="flex items-center gap-4">

            {/* Avatar */}

            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-xl font-bold text-white">
              {avatarLetter}
            </div>

            {/* User information */}

            <div className="min-w-0 flex-1">

              {!isEditingUsername ? (
                <>
                  <div className="flex items-center gap-2">

                    <h2 className="truncate text-lg font-bold text-white">
                      {username}
                    </h2>

                    <button
                      type="button"
                      onClick={
                        startEditingUsername
                      }
                      className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                      aria-label="Edit username"
                      title="Edit username"
                    >
                      <Pencil
                        size={15}
                      />
                    </button>

                  </div>

                  <p className="mt-1 text-sm text-slate-400">
                    Personal Finance Manager
                  </p>
                </>
              ) : (
                <div>

                  <div className="flex items-center gap-2">

                    <input
                      type="text"
                      value={
                        newUsername
                      }
                      onChange={(event) =>
                        setNewUsername(
                          event.target.value
                        )
                      }
                      maxLength={30}
                      autoFocus
                      onKeyDown={(event) => {
                        if (
                          event.key ===
                          "Enter"
                        ) {
                          saveUsername();
                        }

                        if (
                          event.key ===
                          "Escape"
                        ) {
                          cancelEditingUsername();
                        }
                      }}
                      className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-white outline-none focus:border-violet-500"
                      placeholder="Enter username"
                    />

                    {/* Save */}

                    <button
                      type="button"
                      onClick={
                        saveUsername
                      }
                      disabled={
                        savingUsername
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-50"
                      aria-label="Save username"
                      title="Save username"
                    >
                      {savingUsername ? (
                        <Loader2
                          size={16}
                          className="animate-spin"
                        />
                      ) : (
                        <Check
                          size={17}
                        />
                      )}
                    </button>

                    {/* Cancel */}

                    <button
                      type="button"
                      onClick={
                        cancelEditingUsername
                      }
                      disabled={
                        savingUsername
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
                      aria-label="Cancel username edit"
                      title="Cancel"
                    >
                      <X
                        size={17}
                      />
                    </button>

                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Press Enter to save
                  </p>

                </div>
              )}

            </div>
          </div>
        </div>

        {/* =================================================
            NAVIGATION
            ================================================= */}

        <nav className="mt-7 flex-1 px-6">

          <div className="space-y-2">

            {menuItems.map(
              (item) => {
                const Icon =
                  item.icon;

                const isActive =
                  activePage ===
                  item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleNavigation(
                        item.id
                      )
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
                    <Icon
                      size={23}
                    />

                    <span>
                      {item.label}
                    </span>
                  </button>
                );
              }
            )}

          </div>

          {/* =================================================
              QUICK ACTIONS
              ================================================= */}

          <div className="mt-10">

            <p className="mb-4 text-sm font-bold text-slate-400">
              Quick Actions
            </p>

            <button
              type="button"
              onClick={
                exportToCSV
              }
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
              <Download
                size={21}
              />

              Export CSV
            </button>

          </div>
        </nav>

        {/* =================================================
            TIP
            ================================================= */}

        <div className="mx-6 mb-6 rounded-2xl bg-slate-900 p-5">

          <div className="flex items-center gap-2">

            <span className="text-xl">
              💡
            </span>

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