import { useState } from "react";

function UsernameModal({
  isOpen,
  onSubmit,
  loading = false,
}) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Please enter a username.");
      return;
    }

    if (cleanUsername.length < 3) {
      setError("Username must contain at least 3 characters.");
      return;
    }

    if (cleanUsername.length > 20) {
      setError("Username must contain at most 20 characters.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setError(
        "Username can contain only letters, numbers, and underscores."
      );
      return;
    }

    setError("");
    onSubmit(cleanUsername);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-7 shadow-2xl">
        <div className="mb-7 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600 text-2xl font-extrabold text-white">
            F
          </div>

          <h2 className="mt-5 text-2xl font-extrabold text-white">
            Choose your username
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            This username will be displayed on your
            Finora AI account.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="username"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Username
          </label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
              setError("");
            }}
            placeholder="e.g. yourname123"
            autoFocus
            disabled={loading}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-500 disabled:opacity-50"
          />

          <p className="mt-2 text-xs text-slate-500">
            3–20 characters. Letters, numbers and underscores only.
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-violet-600 py-3 font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Saving username..."
              : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UsernameModal;