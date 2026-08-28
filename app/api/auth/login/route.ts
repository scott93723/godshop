import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "請輸入 Email 與密碼" }, { status: 400 });
  }

  const user = await (await getDb()).user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ error: "Email 或密碼錯誤" }, { status: 401 });
  }

  await createSession(user.id);
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
}
