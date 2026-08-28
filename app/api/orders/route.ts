import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import type { OrderDTO } from "@/lib/types";

type OrderWithItems = {
  id: string;
  total: number;
  status: string;
  recipient: string;
  address: string;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    color: string | null;
    product: { slug: string; name: string; nameEn: string; model3d: string };
  }[];
};

function toOrderDTO(o: OrderWithItems): OrderDTO {
  return {
    id: o.id,
    total: o.total,
    status: o.status,
    recipient: o.recipient,
    address: o.address,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      productId: i.productId,
      slug: i.product.slug,
      name: i.product.name,
      nameEn: i.product.nameEn,
      model3d: i.product.model3d,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      color: i.color,
    })),
  };
}

const includeItems = {
  items: {
    include: {
      product: {
        select: { slug: true, name: true, nameEn: true, model3d: true },
      },
    },
  },
} as const;

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const orders = await prisma.order.findMany({
    where: { userId },
    include: includeItems,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders.map(toOrderDTO));
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "請先登入" }, { status: 401 });
  }

  let body: {
    items?: { productId?: string; quantity?: number; color?: string }[];
    recipient?: string;
    address?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const recipient = body.recipient?.trim();
  const address = body.address?.trim();
  if (!recipient || !address) {
    return NextResponse.json({ error: "請填寫收件人與地址" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "購物車是空的" }, { status: 400 });
  }

  // Server-side price recomputation — never trust client prices.
  const ids = [...new Set(body.items.map((i) => i.productId ?? ""))];
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  const byId = new Map(products.map((p) => [p.id, p]));

  const lines: {
    productId: string;
    quantity: number;
    unitPrice: number;
    color: string | null;
  }[] = [];
  for (const item of body.items) {
    const product = item.productId ? byId.get(item.productId) : undefined;
    const qty = Math.floor(item.quantity ?? 0);
    if (!product || qty <= 0 || qty > 99) {
      return NextResponse.json({ error: "訂單內容有誤" }, { status: 400 });
    }
    lines.push({
      productId: product.id,
      quantity: qty,
      unitPrice: product.price,
      color: item.color ?? null,
    });
  }

  const total = lines.reduce((n, l) => n + l.unitPrice * l.quantity, 0);

  const order = await prisma.order.create({
    data: {
      userId,
      recipient,
      address,
      total,
      status: "PAID",
      items: { create: lines },
    },
    include: includeItems,
  });

  return NextResponse.json(toOrderDTO(order), { status: 201 });
}
