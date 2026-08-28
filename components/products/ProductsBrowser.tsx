"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { ProductDTO } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

const CATEGORY_ZH: Record<string, string> = {
  mobile: "手機",
  audio: "音訊",
  wearable: "穿戴",
  computing: "電腦",
  drone: "無人機",
  vr: "VR",
  tablet: "平板",
};

type SortKey = "featured" | "price-asc" | "price-desc";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured 精選" },
  { value: "price-asc", label: "Price ↓ 價格低→高" },
  { value: "price-desc", label: "Price ↑ 價格高→低" },
];

export default function ProductsBrowser({
  products,
}: {
  products: ProductDTO[];
}) {
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))),
    [products]
  );

  const visible = useMemo(() => {
    const filtered =
      category === "all"
        ? products
        : products.filter((p) => p.category === category);
    const sorted = [...filtered];
    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else
      sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
    return sorted;
  }, [products, category, sort]);

  return (
    <div>
      {/* ---------- filter / sort bar ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["all", ...categories].map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`inline-flex cursor-pointer items-center rounded-full border px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.08em] transition-all ${
                  active
                    ? "border-transparent bg-gradient-to-r from-cyan-400 to-violet-400 font-bold text-[#050510] shadow-[0_0_18px_rgba(34,211,238,0.45)]"
                    : "border-cyan-400/35 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300/70 hover:bg-cyan-400/20"
                }`}
              >
                {c === "all" ? "All 全部" : `${c} ${CATEGORY_ZH[c] ?? ""}`}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label="排序 Sort"
            className="cursor-pointer appearance-none rounded-xl border border-white/15 bg-white/5 py-2.5 pl-4 pr-10 text-sm text-slate-200 outline-none transition-colors hover:border-white/30 focus:border-cyan-400"
          >
            {SORT_OPTIONS.map((o) => (
              <option
                key={o.value}
                value={o.value}
                className="bg-[#0b0b1a] text-slate-200"
              >
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
        </div>
      </div>

      <p className="font-display mt-6 text-xs tracking-[0.25em] text-slate-500">
        SHOWING {visible.length} / {products.length} · 顯示 {visible.length} 件
      </p>

      {/* ---------- product grid ---------- */}
      <motion.div
        layout
        className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {visible.length === 0 && (
        <p className="mt-16 text-center text-slate-500">
          此分類目前沒有商品 No products in this category.
        </p>
      )}
    </div>
  );
}
