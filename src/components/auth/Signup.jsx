import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "../../firebase";

function Signup({ onSignup, onSwitchToLogin }) {
  const [name, setName] = useState("");
const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  // Email/Password Signup
  const handleSignup = async (event) => {
    event.preventDefault();

    setError("");

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Create Firebase Authentication account
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = result.user;

      // Add user's name to Firebase Authentication
      await updateProfile(user, {
  displayName: username.trim(),
});

      // Save user information in Firestore
      await setDoc(doc(db, "users", user.uid), {
  name: name.trim(),
  username: username.trim(),
  email: user.email,
  createdAt: serverTimestamp(),
  provider: "email",
});

      console.log("Account created successfully");

      // Tell parent component signup was successful
      if (onSignup) {
        onSignup(user);
      }
    } catch (error) {
      console.error("Signup error:", error);

      if (error.code === "auth/email-already-in-use") {
        setError("An account already exists with this email.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak.");
      } else {
        setError(
          "Unable to create your account. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Google Signup/Login
  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(
        auth,
        provider
      );

      const user = result.user;

      // Save Google user information in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          name: user.displayName || "",
          email: user.email || "",
          createdAt: serverTimestamp(),
          provider: "google",
        },
        {
          merge: true,
        }
      );

      console.log("Google sign-in successful");

      if (onSignup) {
        onSignup(user);
      }
    } catch (error) {
      console.error("Google signup error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        setError("Google sign-in was cancelled.");
      } else if (
        error.code === "auth/popup-blocked"
      ) {
        setError(
          "The Google sign-in popup was blocked by your browser."
        );
      } else {
        setError(
          "Unable to sign in with Google. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-white">
            Finora AI
          </h1>

          <p className="mt-2 text-slate-400">
            Create your account
          </p>
        </div>

        {/* Signup Form */}
        <form
          onSubmit={handleSignup}
          className="space-y-5"
        >
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter your name"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Username */}
<div>
  <label className="mb-2 block text-sm font-semibold text-slate-300">
    Username
  </label>

  <input
    type="text"
    value={username}
    onChange={(event) =>
      setUsername(event.target.value)
    }
    placeholder="Choose a username"
    required
    minLength={3}
    maxLength={20}
    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
  />

  <p className="mt-1 text-xs text-slate-500">
    This username will appear in your Finora AI account.
  </p>
</div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter your email"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="At least 6 characters"
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl bg-rose-500/10 p-3 text-sm text-rose-400">
              {error}
            </div>
          )}

          {/* Create Account */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white transition hover:bg-violet-500 disabled:opacity-50"
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700" />

          <span className="text-sm text-slate-500">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-700" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full rounded-xl border border-slate-700 bg-white py-3 font-bold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
        >
          Continue with Google
        </button>

        {/* Login */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}

          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-violet-400 hover:text-violet-300"
          >
            Sign In
          </button>
        </p>

      </div>
    </div>
  );
}

export default Signup;