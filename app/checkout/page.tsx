import type { Metadata } from "next";
import CheckoutForm from "@/components/commerce/CheckoutForm";

export const metadata: Metadata = { title: "結帳 Checkout — GODSHOP" };

export default function CheckoutPage() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <span className="badge-chip">CHECKOUT</span>
      <h1 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
        <span className="text-gradient">CHECKOUT</span> 結帳
      </h1>
      <div className="mt-10">
        <CheckoutForm />
      </div>
    </section>
  );
}
