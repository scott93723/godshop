import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";
import type { OrderDTO } from "@/lib/types";
import OrdersList from "@/components/commerce/OrdersList";

export const metadata: Metadata = { title: "我的訂單 Orders — GODSHOP" };

// Mirrors the mapping in app/api/orders/route.ts.
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

export default async function OrdersPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login?next=/orders");

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: { slug: true, name: true, nameEn: true, model3d: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <span className="badge-chip">ORDERS</span>
      <h1 className="font-display mt-4 text-4xl font-bold sm:text-5xl">
        <span className="text-gradient">MY ORDERS</span> 我的訂單
      </h1>
      <div className="mt-10">
        <OrdersList orders={orders.map(toOrderDTO)} />
      </div>
    </section>
  );
}
