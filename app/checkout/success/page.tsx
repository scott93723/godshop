import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import SuccessCheck from "@/components/commerce/SuccessCheck";

export const metadata: Metadata = { title: "訂單成立 — GODSHOP" };

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;

  return (
    <section className="grid-bg flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="glass w-full max-w-xl rounded-3xl px-8 py-14 text-center">
        <div className="flex justify-center">
          <SuccessCheck />
        </div>
        <h1 className="font-display mt-8 text-4xl font-bold sm:text-5xl">
          <span className="text-gradient">ORDER CONFIRMED</span>
        </h1>
        <p className="mt-3 text-xl font-semibold">訂單成立！</p>
        {order && (
          <p className="mt-6">
            <span className="inline-flex items-center rounded-full border border-cyan-400/35 bg-cyan-400/10 px-4 py-1.5 font-mono text-xs text-cyan-200">
              訂單編號&nbsp;{order}
            </span>
          </p>
        )}
        <p className="mt-6 text-sm text-slate-400">
          模擬付款成功 Payment simulated — no real charge.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <Link href="/orders" className="btn-neon">
            <Package size={17} /> 查看訂單 View Orders
          </Link>
          <Link href="/products" className="btn-ghost">
            繼續購物 Keep Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
