import { useEffect, useRef, useState } from "react";

import {
  Bell,
  Menu,
  Moon,
  Sun,
  Plus,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  FileText,
  X,
} from "lucide-react";

import {
  doc,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase";

function Header({
  currentUser,
  isDarkMode,
  toggleTheme,
  openSidebar,
  openForm,
  notifications,
  setNotifications,
}) {
  const [showNotifications, setShowNotifications] =
    useState(false);

  /*
   * Username state
   *
   * Initial value comes directly from Firebase user.
   * Firestore can update it later.
   */
  const [username, setUsername] = useState(
    currentUser?.username ||
      currentUser?.displayName ||
      currentUser?.email?.split("@")[0] ||
      "User"
  );

  const notificationRef = useRef(null);

  /*
   * =====================================================
   * LOAD USERNAME FROM FIRESTORE
   * =====================================================
   */

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
          const data = snapshot.data();

          setUsername(
            data.username ||
              currentUser.displayName ||
              currentUser.email?.split("@")[0] ||
              "User"
          );

          return;
        }

        setUsername(
          currentUser.displayName ||
            currentUser.email?.split("@")[0] ||
            "User"
        );
      },
      (error) => {
        console.error(
          "Error loading username:",
          error
        );

        setUsername(
          currentUser.displayName ||
            currentUser.email?.split("@")[0] ||
            "User"
        );
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  /*
   * =====================================================
   * UPDATE INITIAL USERNAME WHEN USER CHANGES
   * =====================================================
   *
   * This is calculated during render rather than using
   * another effect.
   */

  const displayUsername =
    username ||
    currentUser?.displayName ||
    currentUser?.email?.split("@")[0] ||
    "User";

  /*
   * =====================================================
   * AVATAR
   * =====================================================
   */

  const avatarLetter =
    displayUsername
      .charAt(0)
      .toUpperCase() || "U";

  /*
   * =====================================================
   * NOTIFICATION COUNT
   * =====================================================
   */

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  /*
   * =====================================================
   * CLOSE NOTIFICATIONS WHEN CLICKING OUTSIDE
   * =====================================================
   */

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(
          event.target
        )
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /*
   * =====================================================
   * MARK ALL NOTIFICATIONS AS READ
   * =====================================================
   */

  const markAllAsRead = () => {
    setNotifications(
      (previousNotifications) =>
        previousNotifications.map(
          (notification) => ({
            ...notification,
            read: true,
          })
        )
    );
  };

  /*
   * =====================================================
   * MARK ONE NOTIFICATION AS READ
   * =====================================================
   */

  const markNotificationAsRead = (
    notificationId
  ) => {
    setNotifications(
      (previousNotifications) =>
        previousNotifications.map(
          (notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  read: true,
                }
              : notification
        )
    );
  };

  /*
   * =====================================================
   * CLEAR NOTIFICATIONS
   * =====================================================
   */

  const clearNotifications = () => {
    setNotifications([]);
    setShowNotifications(false);
  };

  /*
   * =====================================================
   * RETURN
   * =====================================================
   */

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95 sm:px-6">

      <div className="flex items-center justify-between gap-4">

        {/* =================================================
            LEFT
            ================================================= */}

        <div className="flex items-center gap-3">

          {/* Mobile sidebar */}

          <button
            type="button"
            onClick={openSidebar}
            className="rounded-xl border border-slate-200 p-2.5 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white sm:text-lg">
              Welcome to Finora AI
            </h2>

            <p className="hidden text-sm text-slate-500 dark:text-slate-400 sm:block">
              Manage your income, expenses,
              budgets, and financial insights
              in one place.
            </p>
          </div>

        </div>

        {/* =================================================
            RIGHT
            ================================================= */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* DARK MODE */}

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* =================================================
              NOTIFICATIONS
              ================================================= */}

          <div
            ref={notificationRef}
            className="relative"
          >

            <button
              type="button"
              onClick={() =>
                setShowNotifications(
                  (previous) => !previous
                )
              }
              className="relative rounded-xl p-2.5 text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label="Notifications"
            >
              <Bell size={22} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-[350px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">

                {/* Notification header */}

                <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Notifications
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {unreadCount > 0
                        ? `${unreadCount} unread`
                        : "All caught up"}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowNotifications(false)
                    }
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                    aria-label="Close notifications"
                  >
                    <X size={20} />
                  </button>

                </div>

                {/* Notifications */}

                <div className="max-h-80 overflow-y-auto p-3">

                  {notifications.length === 0 ? (
                    <div className="py-8 text-center">

                      <Bell
                        size={32}
                        className="mx-auto mb-3 text-slate-400"
                      />

                      <p className="font-semibold text-slate-900 dark:text-white">
                        No notifications
                      </p>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        You're all caught up.
                      </p>

                    </div>
                  ) : (
                    <div className="space-y-2">

                      {notifications.map(
                        (notification) => (
                          <button
                            type="button"
                            key={notification.id}
                            onClick={() =>
                              markNotificationAsRead(
                                notification.id
                              )
                            }
                            className={`flex w-full gap-3 rounded-xl p-3 text-left transition ${
                              notification.read
                                ? "opacity-60"
                                : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700"
                            }`}
                          >

                            {notification.type ===
                            "success" ? (
                              <CheckCircle
                                size={22}
                                className="mt-0.5 shrink-0 text-green-500"
                              />
                            ) : notification.type ===
                              "warning" ? (
                              <AlertTriangle
                                size={22}
                                className="mt-0.5 shrink-0 text-yellow-500"
                              />
                            ) : (
                              <FileText
                                size={22}
                                className="mt-0.5 shrink-0 text-blue-500"
                              />
                            )}

                            <p className="text-sm text-slate-800 dark:text-slate-200">
                              {notification.message}
                            </p>

                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

                {/* Footer */}

                {notifications.length > 0 && (
                  <div className="border-t border-slate-200 p-3 dark:border-slate-700">

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={markAllAsRead}
                        disabled={
                          unreadCount === 0
                        }
                        className="flex-1 rounded-xl bg-violet-600 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Mark all as read
                      </button>

                      <button
                        type="button"
                        onClick={clearNotifications}
                        className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        Clear
                      </button>

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* =================================================
              ADD TRANSACTION
              ================================================= */}

          <button
            type="button"
            onClick={openForm}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-3 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700 sm:px-4"
          >
            <Plus size={18} />

            <span>
              Add Transaction
            </span>
          </button>

          {/* =================================================
              USER
              ================================================= */}

          <div className="ml-1 hidden items-center gap-3 border-l border-slate-200 pl-4 dark:border-slate-700 md:flex">

            {/* Avatar */}

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-pink-500 font-bold text-white">
              {avatarLetter}
            </div>

            {/* Username */}

            <div>
              <p className="max-w-[180px] truncate text-sm font-bold text-slate-900 dark:text-white">
                {displayUsername}
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Personal account
              </p>
            </div>

            <ChevronDown
              size={17}
              className="text-slate-400"
            />

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;