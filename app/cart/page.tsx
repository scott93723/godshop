import type { Metadata } from "next";
import CartView from "@/components/commerce/CartView";

export const metadata: Metadata = { title: "購物車 Cart — GODSHOP" };

export default function CartPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <span className="badge-chip">CART</span>
      <h1 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
        <span className="text-gradient">YOUR CART</span> 購物車
      </h1>
      <div className="mt-10">
        <CartView />
      </div>
    </section>
  );
}
