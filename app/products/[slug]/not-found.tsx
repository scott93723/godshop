import Link from "next/link";
import { ArrowLeft, WifiOff } from "lucide-react";

export default function ProductNotFound() {
  return (
    <section className="grid-bg relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6">
      <div className="glass relative rounded-3xl px-8 py-16 text-center sm:px-16">
        <WifiOff size={40} className="mx-auto text-cyan-300" />
        <p className="font-display mt-6 text-7xl font-bold tracking-tight sm:text-8xl">
          <span className="text-gradient">404</span>
        </p>
        <h1 className="font-display mt-4 text-2xl font-semibold tracking-[0.15em]">
          SIGNAL LOST <span className="text-slate-300">訊號遺失</span>
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
          你要找的商品不存在或已下架。
          <br />
          The product you are looking for drifted out of orbit.
        </p>
        <div className="mt-8">
          <Link href="/products" className="btn-neon">
            <ArrowLeft size={18} /> 返回全部商品 Back to Products
          </Link>
        </div>
      </div>
    </section>
  );
}
