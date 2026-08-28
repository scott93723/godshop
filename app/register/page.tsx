import type { Metadata } from "next";
import RegisterForm from "@/components/commerce/RegisterForm";

export const metadata: Metadata = { title: "註冊 Register — GODSHOP" };

export default function RegisterPage() {
  return (
    <section className="grid-bg flex min-h-[85vh] items-center justify-center px-6 py-16">
      <RegisterForm />
    </section>
  );
}
