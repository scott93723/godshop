"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import {
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingCart,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "@/lib/store";

type Me = { id: string; email: string; name: string };

/** Hydration-safe "mounted" flag: false on the server/first client render, true after. */
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function Navbar() {
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<Me | null>(null);
  const { count } = useCart();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Me | null) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    location.reload();
  };

  const cartCount = mounted ? count() : 0;

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          className="font-display flex items-center gap-2 text-xl font-bold tracking-wide"
        >
          <Zap size={20} className="text-cyan-400" />
          <span>
            GOD<span className="text-gradient">SHOP</span>
          </span>
        </Link>

        {/* desktop */}
        <div className="hidden items-center gap-7 text-sm md:flex">
          <Link
            href="/products"
            className="text-slate-300 transition hover:text-cyan-300"
          >
            Products 商品
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 text-slate-300 transition hover:text-cyan-300"
          >
            <ShoppingCart size={17} />
            Cart 購物車
            {mounted && cartCount > 0 && (
              <span className="absolute -right-4 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 px-1 text-[10px] font-bold text-[#050510]">
                {cartCount}
              </span>
            )}
          </Link>
          {mounted && user ? (
            <>
              <span className="text-slate-400">Hi, {user.name}</span>
              <Link
                href="/orders"
                className="flex items-center gap-1 text-slate-300 transition hover:text-cyan-300"
              >
                <Package size={16} /> 訂單 Orders
              </Link>
              <button
                onClick={logout}
                className="btn-ghost px-4 py-1.5 text-xs"
              >
                <LogOut size={14} /> 登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1 text-slate-300 transition hover:text-cyan-300"
              >
                <LogIn size={16} /> Login 登入
              </Link>
              <Link href="/register" className="btn-neon px-5 py-2 text-xs">
                <UserPlus size={14} /> 註冊
              </Link>
            </>
          )}
        </div>

        {/* mobile toggle */}
        <button
          className="text-slate-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="切換選單"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* mobile menu */}
      {open && (
        <div className="glass flex flex-col gap-4 border-t border-white/10 px-6 py-5 text-sm md:hidden">
          <Link
            href="/products"
            onClick={() => setOpen(false)}
            className="text-slate-300"
          >
            Products 商品
          </Link>
          <Link
            href="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-1.5 text-slate-300"
          >
            <ShoppingCart size={16} /> Cart 購物車
            {mounted && cartCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 px-1 text-[10px] font-bold text-[#050510]">
                {cartCount}
              </span>
            )}
          </Link>
          {mounted && user ? (
            <>
              <span className="text-slate-400">Hi, {user.name}</span>
              <Link
                href="/orders"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1 text-slate-300"
              >
                <Package size={16} /> 訂單 Orders
              </Link>
              <button
                onClick={logout}
                className="btn-ghost self-start px-4 py-1.5 text-xs"
              >
                <LogOut size={14} /> 登出
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="flex items-center gap-1 text-slate-300"
              >
                <LogIn size={16} /> Login 登入
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="btn-neon self-start px-5 py-2 text-xs"
              >
                <UserPlus size={14} /> 註冊
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
