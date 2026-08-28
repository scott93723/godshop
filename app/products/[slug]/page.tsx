import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAllProducts, getProductBySlug } from "@/lib/products";
import ProductDetail from "@/components/products/ProductDetail";
import ProductCard from "@/components/products/ProductCard";

type Props = { params: Promise<{ slug: string }> };

// Data comes from the D1 binding at request time — never prerender at build.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "404 — SIGNAL LOST — GODSHOP" };
  return {
    title: `${product.nameEn} ${product.name} — GODSHOP`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const all = await getAllProducts();
  const sameCategory = all.filter(
    (p) => p.id !== product.id && p.category === product.category
  );
  const others = all.filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  const related = [...sameCategory, ...others].slice(0, 3);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-12 md:py-16">
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-cyan-300"
        >
          <ArrowLeft size={16} /> 全部商品 All Products
        </Link>
        <div className="mt-8">
          <ProductDetail product={product} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="border-t border-white/10 pt-14">
            <span className="badge-chip">MORE · 推薦商品</span>
            <h2 className="font-display mt-4 text-3xl font-bold sm:text-4xl">
              YOU MAY <span className="text-gradient">ALSO LIKE</span>{" "}
              你可能也喜歡
            </h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
