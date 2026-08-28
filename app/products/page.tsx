import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import ProductsBrowser from "@/components/products/ProductsBrowser";

export const metadata: Metadata = {
  title: "ALL PRODUCTS 全部商品 — GODSHOP",
  description:
    "GODSHOP 全系列未來科技裝備:手機、耳機、穿戴、筆電、無人機、VR、平板。360° 3D 實機預覽,所見即所得。",
};

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
      <header>
        <span className="badge-chip">CATALOG · 商品目錄</span>
        <h1 className="font-display mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
          <span className="text-gradient">ALL PRODUCTS</span> 全部商品
        </h1>
        <p className="mt-4 max-w-xl text-slate-400">
          全系列未來科技裝備,一次看個夠。每件商品皆支援 360° 3D
          實機預覽,所見即所得。
        </p>
        <p className="font-display mt-6 text-xs tracking-[0.25em] text-slate-500">
          {products.length} ITEMS · 件商品
        </p>
      </header>
      <div className="mt-10">
        <ProductsBrowser products={products} />
      </div>
    </section>
  );
}
