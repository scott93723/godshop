"use client";

import dynamic from "next/dynamic";
import type { ProductCanvasProps } from "./ProductCanvas";

const ProductCanvas = dynamic(() => import("./ProductCanvas"), {
  ssr: false,
  loading: () => (
    <div className="glass flex h-full w-full animate-pulse items-center justify-center rounded-xl">
      <span className="font-display text-xs tracking-[0.3em] text-cyan-300/50">
        LOADING 3D
      </span>
    </div>
  ),
});

export default function LazyProductCanvas({
  className,
  ...props
}: ProductCanvasProps) {
  return (
    <div className={className}>
      <ProductCanvas {...props} className="h-full w-full" />
    </div>
  );
}
