import type { Metadata } from "next";
import LoginForm from "@/components/commerce/LoginForm";

export const metadata: Metadata = { title: "登入 Login — GODSHOP" };

export default function LoginPage() {
  return (
    <section className="grid-bg flex min-h-[85vh] items-center justify-center px-6 py-16">
      <LoginForm />
    </section>
  );
}
