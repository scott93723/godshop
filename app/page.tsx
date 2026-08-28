import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ShieldCheck,
  Sparkles,
  Truck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { getFeaturedProducts } from "@/lib/products";
import LazyHeroScene from "@/components/three/LazyHeroScene";
import FeaturedGrid from "@/components/home/FeaturedGrid";

const MARQUEE_SPECS = [
  "120Hz ProMotion",
  "-48dB ANC",
  "4K/60fps HDR",
  "雙 4K Micro-OLED",
  "38min Flight",
  "14天續航",
  "Wi-Fi 7",
  "鈦合金機身",
  "IP68 防水",
  "Spatial Audio",
];

const PERKS: { icon: LucideIcon; en: string; zh: string; desc: string }[] = [
  {
    icon: Zap,
    en: "LIGHTNING FAST",
    zh: "極速出貨",
    desc: "今日下單,24 小時內火速出貨,快到不像話。",
  },
  {
    icon: ShieldCheck,
    en: "1-YEAR WARRANTY",
    zh: "一年保固",
    desc: "全館商品原廠一年保固,售後無憂,用得安心。",
  },
  {
    icon: Truck,
    en: "FREE SHIPPING",
    zh: "全台免運",
    desc: "台灣本島免運費,偏遠離島同樣享有優惠。",
  },
  {
    icon: Sparkles,
    en: "3D PREVIEW",
    zh: "3D 實機預覽",
    desc: "每件商品 360° 旋轉檢視,所見即所得。",
  },
];

export default async function Home() {
  const featured = await getFeaturedProducts();

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative h-[92vh] overflow-hidden">
        <LazyHeroScene />
        <div className="pointer-events-none relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
          <span className="badge-chip">NEW · 2026 COLLECTION</span>
          <h1 className="font-display mt-6 text-6xl font-bold leading-[0.95] tracking-tight sm:text-7xl lg:text-8xl">
            <span className="text-gradient">
              SHOP THE
              <br />
              FUTURE.
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-base text-slate-400 sm:text-lg">
            未來科技,今日入手。GODSHOP 精選最強 3C 裝備。
          </p>
          <div className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products" className="btn-neon">
              立即選購 Shop Now <ArrowRight size={18} />
            </Link>
            <Link href="#featured" className="btn-ghost">
              探索 Explore
            </Link>
          </div>
        </div>
        <div className="animate-float absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <ChevronDown size={26} className="text-cyan-300/70" />
        </div>
      </section>

      {/* ---------- MARQUEE ---------- */}
      <section className="overflow-hidden border-y border-white/10 py-5">
        <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
          {[...MARQUEE_SPECS, ...MARQUEE_SPECS].map((s, i) => (
            <span
              key={i}
              className="font-display text-sm tracking-[0.2em] text-slate-500"
            >
              {s} <span className="text-cyan-400">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ---------- FEATURED ---------- */}
      <section id="featured" className="mx-auto max-w-7xl scroll-mt-20 px-6 py-24">
        <div className="flex items-end justify-between">
          <div>
            <span className="badge-chip">HOT · 熱銷排行</span>
            <h2 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
              <span className="text-gradient">FEATURED</span> 精選裝備
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden items-center gap-1 text-sm text-cyan-300 transition-all hover:gap-2 sm:flex"
          >
            全部商品 <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-12">
          <FeaturedGrid products={featured} />
        </div>
      </section>

      {/* ---------- WHY GODSHOP ---------- */}
      <section className="mx-auto max-w-7xl px-6 pb-8">
        <h2 className="font-display text-center text-4xl font-bold sm:text-5xl">
          WHY <span className="text-gradient">GODSHOP</span>
        </h2>
        <p className="mt-3 text-center text-slate-400">
          為什麼大家都選 GODSHOP?
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((perk) => (
            <div
              key={perk.en}
              className="glass card-glow rounded-2xl p-6 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10">
                <perk.icon size={22} className="text-cyan-300" />
              </div>
              <h3 className="font-display mt-4 text-sm font-semibold tracking-[0.15em]">
                {perk.en}
              </h3>
              <p className="mt-1 font-semibold text-slate-200">{perk.zh}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {perk.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FINAL CTA ---------- */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid-bg glass relative overflow-hidden rounded-3xl px-6 py-20 text-center">
          <h2 className="font-display text-4xl font-bold sm:text-6xl">
            <span className="text-gradient">READY TO UPGRADE?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md text-slate-400">
            升級你的裝備,就在今天。全場免運,一年保固。
          </p>
          <div className="mt-8">
            <Link href="/products" className="btn-neon">
              進入商城 Enter Shop <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
