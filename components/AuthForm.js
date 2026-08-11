"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmail, signUpWithEmail, signInWithGoogle, onAuthChange } from "@/lib/auth";

const DEMO_USER_KEY = "skilldot_demo_mode";

export default function AuthForm() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // If the user is already logged in (e.g. they closed the app and reopened it)
    // redirect them straight to the dashboard so they don't see the login form again.
    const unsub = onAuthChange((user) => {
      if (user) {
        router.push("/dashboard");
      }
    });
    return () => unsub();
  }, [router]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        if (!form.name.trim()) { setError("Name is required"); setLoading(false); return; }
        await signUpWithEmail(form.email, form.password, form.name.trim());
      } else {
        await signInWithEmail(form.email, form.password);
      }
      router.push("/dashboard");
    } catch (err) {
      const msg = getFriendlyError(err.code);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    // Store demo flag in localStorage — dashboard will detect this and use localStorage for progress
    localStorage.setItem(DEMO_USER_KEY, "true");
    router.push("/dashboard");
  };

  return (
    <div className="auth-card glass">
      {/* Demo Banner */}
      <div className="demo-banner" onClick={handleDemo} role="button" tabIndex={0} id="auth-demo-banner"
        onKeyDown={(e) => e.key === "Enter" && handleDemo()}>
        <span className="demo-banner-icon">⚡</span>
        <div className="demo-banner-text">
          <strong>Try Demo — no account needed</strong>
          <span>Explore the full app instantly</span>
        </div>
        <span className="demo-banner-arrow">→</span>
      </div>

      <div className="auth-header">
        <div className="auth-logo">
          <span className="brand-dot">●</span>
          <span className="brand-text">SkillDot</span>
        </div>
        <h2 className="auth-title">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h2>
        <p className="auth-subtitle">
          {mode === "signin"
            ? "Pick up right where you left off."
            : "Start tracking your aptitude journey today."}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="auth-toggle">
        <button
          className={`auth-toggle-btn ${mode === "signin" ? "active" : ""}`}
          onClick={() => { setMode("signin"); setError(""); }}
          id="auth-signin-tab"
        >
          Sign In
        </button>
        <button
          className={`auth-toggle-btn ${mode === "signup" ? "active" : ""}`}
          onClick={() => { setMode("signup"); setError(""); }}
          id="auth-signup-tab"
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleSubmit} className="auth-form" id="auth-form">
        {mode === "signup" && (
          <div className="form-group">
            <label className="form-label" htmlFor="auth-name">Full Name</label>
            <input
              id="auth-name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="form-input"
              autoComplete="name"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label className="form-label" htmlFor="auth-email">Email</label>
          <input
            id="auth-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className="form-input"
            autoComplete="email"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            className="form-input"
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
            minLength={6}
          />
        </div>

        {error && <div className="auth-error" role="alert">{error}</div>}

        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
          id="auth-submit-btn"
        >
          {loading ? <span className="spinner" /> : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="auth-divider"><span>or continue with</span></div>

      <button
        className="btn btn-google btn-full"
        onClick={handleGoogle}
        disabled={loading}
        id="auth-google-btn"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Continue with Google
      </button>
    </div>
  );
}

function getFriendlyError(code) {
  const map = {
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/invalid-credential": "Invalid email or password.",
    "auth/popup-closed-by-user": "Sign-in popup was closed. Please try again.",
  };
  return map[code] || "An error occurred. Please try again.";
}
