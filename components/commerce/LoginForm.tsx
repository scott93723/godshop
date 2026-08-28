"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "登入失敗，請稍後再試");
        setSubmitting(false);
        return;
      }
      // Full reload so the Navbar re-fetches auth state.
      window.location.href =
        new URLSearchParams(window.location.search).get("next") || "/";
    } catch {
      setError("網路錯誤，請稍後再試");
      setSubmitting(false);
    }
  };

  return (
    <div className="glass w-full max-w-md rounded-3xl p-8 sm:p-10">
      <span className="badge-chip">WELCOME BACK</span>
      <h1 className="font-display mt-4 text-4xl font-bold">
        <span className="text-gradient">LOGIN</span> 登入
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        登入以結帳並查看你的訂單。
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-slate-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="input-dark"
            placeholder="you@future.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-slate-400">
            密碼 Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className="input-dark"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-neon w-full">
          {submitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              登入中 Signing in…
            </>
          ) : (
            <>
              <LogIn size={17} /> 登入 Sign In
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        還沒有帳號？
        <Link
          href="/register"
          className="ml-1 text-cyan-300 transition hover:text-cyan-200"
        >
          註冊 Register
        </Link>
      </p>
    </div>
  );
}
