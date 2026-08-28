import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const { id } = await params;
  const order = await (await getDb()).order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { slug: true, name: true, nameEn: true, model3d: true },
          },
        },
      },
    },
  });
  if (!order || order.userId !== userId) {
    return NextResponse.json({ error: "訂單不存在" }, { status: 404 });
  }
  return NextResponse.json({
    id: order.id,
    total: order.total,
    status: order.status,
    recipient: order.recipient,
    address: order.address,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
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
  });
}
