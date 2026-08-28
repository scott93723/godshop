"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, MapPin, Package, User } from "lucide-react";
import type { OrderDTO } from "@/lib/types";
import { TWD } from "@/lib/format";
import LazyProductCanvas from "@/components/three/LazyProductCanvas";

function OrderCard({ order }: { order: OrderDTO }) {
  const [open, setOpen] = useState(false);
  const shortId =
    order.id.length > 12 ? order.id.slice(0, 12) + "…" : order.id;

  return (
    <article className="glass card-glow rounded-2xl p-5">
      <div className="flex flex-wrap items-center gap-3">
        <span
          title={order.id}
          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-slate-300"
        >
          #{shortId}
        </span>
        <span className="text-sm text-slate-400" suppressHydrationWarning>
          {new Date(order.createdAt).toLocaleString("zh-TW")}
        </span>
        <span className="badge-chip ml-auto">{order.status} 已付款</span>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-sm text-slate-300">
        <span className="flex items-center gap-1.5">
          <User size={14} className="text-cyan-300" />
          {order.recipient}
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin size={14} className="text-cyan-300" />
          {order.address}
        </span>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 flex items-center gap-1.5 text-sm text-cyan-300 transition hover:text-cyan-200"
      >
        <Package size={15} />
        {order.items.length} 件商品 Items
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul className="mt-4 space-y-4 border-t border-white/10 pt-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <LazyProductCanvas
                type={item.model3d}
                color={item.color ?? undefined}
                autoRotate
                className="h-16 w-16 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-sm font-semibold">
                  {item.nameEn}
                </p>
                <p className="truncate text-xs text-slate-400">{item.name}</p>
                {item.color && (
                  <p className="mt-1">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-full border border-white/20"
                      style={{ background: item.color }}
                    />
                  </p>
                )}
              </div>
              <span className="text-xs whitespace-nowrap text-slate-400">
                {item.quantity} × {TWD(item.unitPrice)}
              </span>
              <span className="font-display w-24 shrink-0 text-right text-sm font-semibold text-cyan-300">
                {TWD(item.unitPrice * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex justify-end border-t border-white/10 pt-4">
        <p className="text-sm text-slate-400">
          訂單總額 Total&nbsp;
          <span className="font-display text-gradient text-lg font-bold">
            {TWD(order.total)}
          </span>
        </p>
      </div>
    </article>
  );
}

export default function OrdersList({ orders }: { orders: OrderDTO[] }) {
  if (orders.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg rounded-3xl px-8 py-16 text-center">
        <Package
          size={56}
          strokeWidth={1.2}
          className="mx-auto text-slate-600"
        />
        <p className="mt-6 text-lg font-semibold text-slate-200">
          還沒有任何訂單
        </p>
        <p className="mt-1 text-sm text-slate-400">No orders yet</p>
        <Link href="/products" className="btn-neon mt-8">
          去逛逛 Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
