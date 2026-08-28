"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="grid-bg absolute inset-0 animate-pulse bg-[#050510]" />
  ),
});

export default function LazyHeroScene() {
  return (
    <div className="absolute inset-0">
      <HeroScene />
    </div>
  );
}
