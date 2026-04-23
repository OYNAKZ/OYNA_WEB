import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";

import { ApiError } from "../lib/apiClient";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@oyna.local");
  const [password, setPassword] = useState("admin-password-123");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      const nextPath = (location.state as { from?: string } | null)?.from || "/";
      navigate(nextPath, { replace: true });
    } catch (requestError) {
      const message = requestError instanceof ApiError ? requestError.message : "Failed to sign in";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] px-4">
      <div className="w-full max-w-md rounded-2xl border border-[#1E293B] bg-[#111827] p-8 text-white shadow-2xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#60A5FA]">OYNA WEB</p>
          <h1 className="mt-3 text-3xl font-semibold">Admin Sign In</h1>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Local development login for the OYNA operations dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#CBD5E1]">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition focus:border-[#60A5FA]"
              autoComplete="username"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#CBD5E1]">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#334155] bg-[#0F172A] px-4 py-3 text-sm text-white outline-none transition focus:border-[#60A5FA]"
              autoComplete="current-password"
            />
          </label>

          {error ? <p className="text-sm text-[#FCA5A5]">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
