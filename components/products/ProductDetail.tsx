"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import { TWD } from "@/lib/format";
import { useCart } from "@/lib/store";
import LazyProductCanvas from "@/components/three/LazyProductCanvas";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductDetail({ product }: { product: ProductDTO }) {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [exploded, setExploded] = useState(false);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [hasAdded, setHasAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const addToCart = () => {
    useCart.getState().add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        nameEn: product.nameEn,
        price: product.price,
        model3d: product.model3d,
        color: selectedColor,
      },
      qty
    );
    setAdded(true);
    setHasAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {/* ---------- LEFT: 3D viewer ---------- */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div className="glass relative overflow-hidden rounded-3xl p-3 md:p-4">
          <span className="badge-chip absolute left-6 top-6 z-10">
            360° · 互動預覽
          </span>
          <LazyProductCanvas
            type={product.model3d}
            color={selectedColor}
            exploded={exploded}
            interactive
            autoRotate
            className="h-[55vh] w-full md:h-[65vh]"
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          {/* color swatches */}
          <div className="flex items-center gap-3">
            {product.colors.map((c) => {
              const active = c === selectedColor;
              return (
                <button
                  key={c}
                  type="button"
                  title={c}
                  aria-label={`顏色 Color ${c}`}
                  aria-pressed={active}
                  onClick={() => setSelectedColor(c)}
                  style={{ backgroundColor: c }}
                  className={`h-9 w-9 cursor-pointer rounded-full border border-white/20 transition-all ${
                    active
                      ? "scale-110 ring-2 ring-cyan-300 ring-offset-2 ring-offset-[#050510]"
                      : "opacity-70 hover:scale-105 hover:opacity-100"
                  }`}
                />
              );
            })}
          </div>

          {/* explode toggle */}
          <button
            type="button"
            onClick={() => setExploded((v) => !v)}
            aria-pressed={exploded}
            className="btn-ghost"
            style={
              exploded
                ? {
                    borderColor: "rgba(34, 211, 238, 0.8)",
                    background: "rgba(34, 211, 238, 0.15)",
                    color: "#67e8f9",
                    boxShadow: "0 0 18px rgba(34, 211, 238, 0.35)",
                  }
                : undefined
            }
          >
            EXPLODE 分解
          </button>
        </div>
      </motion.div>

      {/* ---------- RIGHT: info ---------- */}
      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      >
        <span className="badge-chip">{product.category}</span>
        <h1 className="font-display mt-4 text-5xl font-bold leading-[0.95] tracking-tight md:text-6xl">
          {product.nameEn}
        </h1>
        <p className="mt-3 text-xl text-slate-400">{product.name}</p>
        <p className="font-display text-gradient mt-6 text-4xl font-bold">
          {TWD(product.price)}
        </p>
        <p className="mt-6 leading-relaxed text-slate-300">
          {product.description}
        </p>

        {/* specs */}
        <dl className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {product.specs.map((s) => (
            <div
              key={s.k}
              className="flex items-baseline justify-between gap-6 py-3"
            >
              <dt className="shrink-0 text-sm text-slate-400">{s.k}</dt>
              <dd className="text-right text-sm font-medium text-slate-100">
                {s.v}
              </dd>
            </div>
          ))}
        </dl>

        {/* quantity + add to cart */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="glass flex items-center rounded-full">
            <button
              type="button"
              aria-label="減少數量 Decrease quantity"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-slate-300 transition-colors hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={16} />
            </button>
            <span className="font-display w-10 text-center text-lg font-semibold">
              {qty}
            </span>
            <button
              type="button"
              aria-label="增加數量 Increase quantity"
              onClick={() => setQty((q) => Math.min(99, q + 1))}
              disabled={qty >= 99}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-slate-300 transition-colors hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={16} />
            </button>
          </div>

          <button type="button" onClick={addToCart} className="btn-neon flex-1">
            <ShoppingCart size={18} /> 加入購物車 Add to Cart
          </button>
        </div>

        {/* confirmation + cart link */}
        <div className="mt-4 min-h-6">
          <AnimatePresence>
            {added && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5 text-sm font-medium text-cyan-300"
              >
                <Check size={16} /> 已加入購物車 Added!
              </motion.p>
            )}
          </AnimatePresence>
          {hasAdded && (
            <Link
              href="/cart"
              className="mt-1 inline-block text-sm text-slate-400 underline decoration-cyan-400/50 underline-offset-4 transition-colors hover:text-cyan-300"
            >
              前往購物車 Go to Cart →
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
}
