"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { ProductDTO } from "@/lib/types";
import { TWD } from "@/lib/format";
import LazyProductCanvas from "@/components/three/LazyProductCanvas";

export default function ProductCard({ product }: { product: ProductDTO }) {
  return (
    <motion.div
      whileHover={{ rotateX: 2, rotateY: -3, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 800 }}
      className="h-full"
    >
      <Link
        href={`/products/${product.slug}`}
        className="glass card-glow relative block h-full overflow-hidden rounded-2xl p-5"
      >
        <span className="badge-chip absolute left-4 top-4 z-10">
          {product.category}
        </span>
        <LazyProductCanvas
          type={product.model3d}
          color={product.colors[0]}
          autoRotate
          className="h-56 w-full"
        />
        <div className="mt-3">
          <h3 className="font-display text-lg font-semibold tracking-wide">
            {product.nameEn}
          </h3>
          <p className="mt-0.5 text-sm text-slate-400">{product.name}</p>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-gradient text-xl font-bold">
              {TWD(product.price)}
            </span>
            <span className="text-xs tracking-widest text-slate-500">
              3D PREVIEW
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
