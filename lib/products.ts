import { prisma } from "@/lib/db";
import type { ProductDTO } from "@/lib/types";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  price: number;
  description: string;
  category: string;
  model3d: string;
  colors: string;
  specs: string;
  featured: boolean;
};

export function toDTO(p: ProductRow): ProductDTO {
  return {
    ...p,
    colors: JSON.parse(p.colors) as string[],
    specs: JSON.parse(p.specs) as ProductDTO["specs"],
  };
}

export async function getAllProducts(): Promise<ProductDTO[]> {
  const rows = await prisma.product.findMany({ orderBy: { price: "desc" } });
  return rows.map(toDTO);
}

export async function getFeaturedProducts(): Promise<ProductDTO[]> {
  const rows = await prisma.product.findMany({ where: { featured: true } });
  return rows.map(toDTO);
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDTO | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? toDTO(row) : null;
}
