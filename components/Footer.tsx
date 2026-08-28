import Link from "next/link";
import { Headset, Mail, MapPin, Phone, Zap } from "lucide-react";

const QUICK_LINKS = [
  { href: "/products", label: "全部商品 All Products" },
  { href: "/cart", label: "購物車 Cart" },
  { href: "/orders", label: "我的訂單 Orders" },
  { href: "/login", label: "登入 Login" },
  { href: "/register", label: "註冊 Register" },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-white/10 bg-[#070714]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3">
        {/* brand */}
        <div>
          <div className="font-display flex items-center gap-2 text-lg font-bold">
            <Zap size={18} className="text-cyan-400" />
            <span>
              GOD<span className="text-gradient">SHOP</span>
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Shop the Future, Now.
            <br />
            未來科技,今日入手 — 全台最炫的 3C
            選物店,每一件裝備都能 3D 實機預覽。
          </p>
        </div>

        {/* quick links */}
        <div>
          <h4 className="font-display text-sm font-semibold tracking-[0.2em] text-slate-300">
            快速連結 QUICK LINKS
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            {QUICK_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="transition hover:text-cyan-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* support */}
        <div>
          <h4 className="font-display text-sm font-semibold tracking-[0.2em] text-slate-300">
            客服 SUPPORT
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
            <li className="flex items-center gap-2">
              <Headset size={15} className="shrink-0 text-cyan-400" />
              線上客服 09:00–21:00(週末不休)
            </li>
            <li className="flex items-center gap-2">
              <Mail size={15} className="shrink-0 text-cyan-400" />
              support@godshop.tw
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="shrink-0 text-cyan-400" />
              0800-888-888
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-cyan-400" />
              台北市信義區松仁路 100 號
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs tracking-wider text-slate-500">
        © 2026 GODSHOP. All rights reserved. · 未來科技,今日入手。
      </div>
    </footer>
  );
}
