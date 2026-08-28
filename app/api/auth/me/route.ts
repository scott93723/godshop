import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUserId } from "@/lib/auth";

export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  const user = await (await getDb()).user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}
