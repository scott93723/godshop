"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";

type FieldErrors = Partial<
  Record<"name" | "email" | "password" | "confirm", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "請填寫姓名";
    if (!EMAIL_RE.test(email.trim())) next.email = "Email 格式不正確";
    if (password.length < 6) next.password = "密碼至少 6 個字元";
    if (confirm !== password) next.confirm = "兩次輸入的密碼不一致";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!res.ok) {
        setApiError(data.error ?? "註冊失敗，請稍後再試");
        setSubmitting(false);
        return;
      }
      // Full reload so the Navbar re-fetches auth state.
      window.location.href =
        new URLSearchParams(window.location.search).get("next") || "/";
    } catch {
      setApiError("網路錯誤，請稍後再試");
      setSubmitting(false);
    }
  };

  const fieldError = (key: keyof FieldErrors) =>
    errors[key] ? (
      <p className="mt-1 text-xs text-rose-400">{errors[key]}</p>
    ) : null;

  return (
    <div className="glass w-full max-w-md rounded-3xl p-8 sm:p-10">
      <span className="badge-chip">NEW ACCOUNT</span>
      <h1 className="font-display mt-4 text-4xl font-bold">
        <span className="text-gradient">JOIN US</span> 註冊
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        建立帳號，入手未來裝備。
      </p>

      <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-slate-400">
            姓名 Name
          </label>
          <input
            id="name"
            autoComplete="name"
            className="input-dark"
            placeholder="王小明"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-slate-400">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className="input-dark"
            placeholder="you@future.dev"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm text-slate-400">
            密碼 Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="input-dark"
            placeholder="至少 6 個字元"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {fieldError("password")}
        </div>
        <div>
          <label htmlFor="confirm" className="mb-1.5 block text-sm text-slate-400">
            確認密碼 Confirm Password
          </label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            className="input-dark"
            placeholder="再次輸入密碼"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          {fieldError("confirm")}
        </div>

        {apiError && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {apiError}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-neon w-full">
          {submitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              註冊中 Creating…
            </>
          ) : (
            <>
              <UserPlus size={17} /> 建立帳號 Sign Up
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        已有帳號？
        <Link
          href="/login"
          className="ml-1 text-cyan-300 transition hover:text-cyan-200"
        >
          登入 Login
        </Link>
      </p>
    </div>
  );
}
