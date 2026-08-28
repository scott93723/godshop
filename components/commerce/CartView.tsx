"use client";

import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/store";
import { TWD } from "@/lib/format";
import LazyProductCanvas from "@/components/three/LazyProductCanvas";
import { useMounted } from "./useMounted";

export default function CartView() {
  const mounted = useMounted();
  const { items, setQty, remove, clear, total } = useCart();

  // Persisted cart rehydrates after mount — render a placeholder until then.
  if (!mounted) {
    return <div className="glass h-72 animate-pulse rounded-3xl" />;
  }

  if (items.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg rounded-3xl px-8 py-16 text-center">
        <ShoppingBag
          size={56}
          strokeWidth={1.2}
          className="mx-auto text-slate-600"
        />
        <p className="mt-6 text-lg font-semibold text-slate-200">
          購物車是空的
        </p>
        <p className="mt-1 text-sm text-slate-400">Your cart is empty</p>
        <Link href="/products" className="btn-neon mt-8">
          去逛逛 Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      {/* ---------- items ---------- */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}::${item.color}`}
            className="glass card-glow flex flex-wrap items-center gap-4 rounded-2xl p-4"
          >
            <LazyProductCanvas
              type={item.model3d}
              color={item.color || undefined}
              autoRotate
              className="h-20 w-20 shrink-0"
            />
            <div className="min-w-0 flex-1 basis-40">
              <h3 className="font-display truncate font-semibold tracking-wide">
                {item.nameEn}
              </h3>
              <p className="truncate text-sm text-slate-400">{item.name}</p>
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500">
                <span
                  className="inline-block h-3 w-3 rounded-full border border-white/20"
                  style={{ background: item.color }}
                />
                {item.color}
              </p>
            </div>
            <span className="hidden text-sm text-slate-400 sm:block">
              {TWD(item.price)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setQty(item.productId, item.color, item.quantity - 1)
                }
                aria-label="減少數量"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                <Minus size={14} />
              </button>
              <span className="font-display w-8 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  setQty(item.productId, item.color, item.quantity + 1)
                }
                aria-label="增加數量"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/12 bg-white/5 text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="font-display w-28 text-right font-semibold text-cyan-300">
              {TWD(item.price * item.quantity)}
            </span>
            <button
              onClick={() => remove(item.productId, item.color)}
              aria-label="移除商品"
              className="text-slate-500 transition hover:text-rose-400"
            >
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>

      {/* ---------- summary ---------- */}
      <aside className="glass rounded-2xl p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-sm font-semibold tracking-[0.2em] text-slate-300">
          SUMMARY 訂單摘要
        </h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">小計 Subtotal</dt>
            <dd>{TWD(total())}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">運費 Shipping</dt>
            <dd className="text-cyan-300">免運 Free</dd>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-semibold">
            <dt>總計 Total</dt>
            <dd className="font-display text-gradient text-xl">
              {TWD(total())}
            </dd>
          </div>
        </dl>
        <Link href="/checkout" className="btn-neon mt-6 w-full">
          前往結帳 Checkout
        </Link>
        <button onClick={clear} className="btn-ghost mt-3 w-full text-sm">
          清空 Clear
        </button>
      </aside>
    </div>
  );
}
