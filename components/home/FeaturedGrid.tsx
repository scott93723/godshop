"use client";

import { motion } from "framer-motion";
import type { ProductDTO } from "@/lib/types";
import ProductCard from "@/components/products/ProductCard";

export default function FeaturedGrid({ products }: { products: ProductDTO[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: (i % 3) * 0.1, ease: "easeOut" }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </div>
  );
}
