import { useState } from "react";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../../firebase";

function Login({ onSwitchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  /* =====================================================
     EMAIL LOGIN
  ===================================================== */

  const handleEmailLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (error) {
      console.error("Email login error:", error);

      switch (error.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/user-not-found":
          setError(
            "No account was found with this email."
          );
          break;

        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError(
            "Incorrect email or password."
          );
          break;

        case "auth/user-disabled":
          setError(
            "This account has been disabled."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many login attempts. Please try again later."
          );
          break;

        default:
          setError(
            "Unable to sign in. Please check your details and try again."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      await signInWithPopup(
        auth,
        provider
      );

    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      switch (error.code) {
        /* ---------------------------------------------
           DOMAIN NOT AUTHORIZED
        --------------------------------------------- */

        case "auth/unauthorized-domain":
          setError(
            "This website is not authorized for Google sign-in. Please add your Vercel domain to Firebase Authentication → Settings → Authorized domains."
          );
          break;

        /* ---------------------------------------------
           POPUP BLOCKED
        --------------------------------------------- */

        case "auth/popup-blocked":
          setError(
            "Google sign-in popup was blocked by your browser. Please allow popups for this website and try again."
          );
          break;

        /* ---------------------------------------------
           USER CLOSED POPUP
        --------------------------------------------- */

        case "auth/popup-closed-by-user":
          setError(
            "Google sign-in was cancelled. Please try again."
          );
          break;

        /* ---------------------------------------------
           ACCOUNT EXISTS WITH DIFFERENT PROVIDER
        --------------------------------------------- */

        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with this email using another sign-in method. Please sign in using your existing email/password account."
          );
          break;

        /* ---------------------------------------------
           OPERATION NOT ALLOWED
        --------------------------------------------- */

        case "auth/operation-not-allowed":
          setError(
            "Google sign-in is not enabled in Firebase Authentication."
          );
          break;

        /* ---------------------------------------------
           NETWORK
        --------------------------------------------- */

        case "auth/network-request-failed":
          setError(
            "Network error. Please check your internet connection and try again."
          );
          break;

        /* ---------------------------------------------
           DEFAULT
        --------------------------------------------- */

        default:
          setError(
            `Google sign-in failed: ${
              error.message ||
              "Please try again."
            }`
          );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

  const handleForgotPassword = async () => {
    setError("");
    setSuccess("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError(
        "Enter your email address first, then click Forgot Password."
      );
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(
        auth,
        cleanEmail
      );

      setSuccess(
        "Password reset email sent. Check your inbox and follow the instructions."
      );

    } catch (error) {
      console.error(
        "Password reset error:",
        error
      );

      switch (error.code) {
        case "auth/invalid-email":
          setError(
            "Please enter a valid email address."
          );
          break;

        case "auth/user-not-found":
          setError(
            "No account was found with this email."
          );
          break;

        case "auth/too-many-requests":
          setError(
            "Too many requests. Please try again later."
          );
          break;

        default:
          setError(
            "Unable to send password reset email. Please try again."
          );
      }
    } finally {
      setResetLoading(false);
    }
  };

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">

      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

        {/* HEADER */}

        <div className="mb-8 text-center">

          <h1 className="text-3xl font-extrabold text-white">
            Finora AI
          </h1>

          <p className="mt-2 text-slate-400">
            Welcome back
          </p>

        </div>

        {/* EMAIL LOGIN */}

        <form
          onSubmit={handleEmailLogin}
          className="space-y-5"
        >

          {/* EMAIL */}

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
              autoComplete="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <label className="text-sm font-semibold text-slate-300">
                Password
              </label>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={resetLoading}
                className="text-xs font-bold text-violet-400 transition hover:text-violet-300 disabled:opacity-50"
              >
                {resetLoading
                  ? "Sending..."
                  : "Forgot Password?"}
              </button>

            </div>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-violet-500"
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm leading-5 text-rose-400">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm leading-5 text-emerald-400">
              {success}
            </div>
          )}

          {/* SIGN IN */}

          <button
            type="submit"
            disabled={loading || resetLoading}
            className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* DIVIDER */}

        <div className="my-6 flex items-center gap-3">

          <div className="h-px flex-1 bg-slate-700" />

          <span className="text-sm text-slate-500">
            OR
          </span>

          <div className="h-px flex-1 bg-slate-700" />

        </div>

        {/* GOOGLE */}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || resetLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white py-3 font-bold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {/* Google G */}

          <span className="text-lg font-extrabold">
            G
          </span>

          <span>
            {loading
              ? "Connecting..."
              : "Continue with Google"}
          </span>

        </button>

        {/* SIGN UP */}

        <p className="mt-6 text-center text-sm text-slate-400">

          Don't have an account?{" "}

          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-bold text-violet-400 transition hover:text-violet-300"
          >
            Sign Up
          </button>

        </p>

      </div>

    </div>
  );
}

export default Login;