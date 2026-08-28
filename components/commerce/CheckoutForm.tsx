"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Banknote, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/store";
import { TWD } from "@/lib/format";
import type { OrderDTO } from "@/lib/types";
import LazyProductCanvas from "@/components/three/LazyProductCanvas";
import { useMounted } from "./useMounted";

type Payment = "card" | "cod";
type FieldErrors = Partial<
  Record<"recipient" | "phone" | "address" | "cardNumber" | "expiry" | "cvc", string>
>;

const formatCardNumber = (v: string) =>
  v
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
};

export default function CheckoutForm() {
  const mounted = useMounted();
  const router = useRouter();
  const { items, clear, total } = useCart();

  const [recipient, setRecipient] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [payment, setPayment] = useState<Payment>("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!mounted) {
    return <div className="glass h-72 animate-pulse rounded-3xl" />;
  }

  if (items.length === 0) {
    return (
      <div className="glass mx-auto max-w-lg rounded-3xl px-8 py-16 text-center">
        <ShoppingBag
          size={56}
          strokeWidth={1.2}
          className="mx-auto text-slate-600"
        />
        <p className="mt-6 text-lg font-semibold text-slate-200">
          購物車是空的
        </p>
        <p className="mt-1 text-sm text-slate-400">
          Your cart is empty — add something first
        </p>
        <Link href="/products" className="btn-neon mt-8">
          去逛逛 Shop Now
        </Link>
      </div>
    );
  }

  // Payment is simulated — validation here is cosmetic only.
  const validate = (): boolean => {
    const next: FieldErrors = {};
    if (!recipient.trim()) next.recipient = "請填寫收件人";
    if (!/^[\d\s+-]{8,}$/.test(phone.trim()))
      next.phone = "請填寫有效的手機號碼";
    if (!address.trim()) next.address = "請填寫收件地址";
    if (payment === "card") {
      if (cardNumber.replace(/\s/g, "").length !== 16)
        next.cardNumber = "卡號需為 16 碼";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry))
        next.expiry = "格式 MM/YY";
      if (!/^\d{3,4}$/.test(cvc)) next.cvc = "CVC 需為 3-4 碼";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            color: i.color,
          })),
          recipient: recipient.trim(),
          address: address.trim(),
        }),
      });
      if (res.status === 401) {
        router.push("/login?next=/checkout");
        return;
      }
      const data: OrderDTO | { error?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok) {
        setApiError(
          "error" in data && data.error ? data.error : "下單失敗，請稍後再試"
        );
        setSubmitting(false);
        return;
      }
      const order = data as OrderDTO;
      clear();
      router.push("/checkout/success?order=" + order.id);
    } catch {
      setApiError("網路錯誤，請稍後再試");
      setSubmitting(false);
    }
  };

  const fieldError = (key: keyof FieldErrors) =>
    errors[key] ? (
      <p className="mt-1 text-xs text-rose-400">{errors[key]}</p>
    ) : null;

  return (
    <form
      onSubmit={submit}
      className="grid items-start gap-8 lg:grid-cols-[1fr_380px]"
    >
      {/* ---------- shipping + payment ---------- */}
      <div className="glass rounded-2xl p-6 sm:p-8">
        <h2 className="font-display text-sm font-semibold tracking-[0.2em] text-slate-300">
          SHIPPING 收件資訊
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="recipient" className="mb-1.5 block text-sm text-slate-400">
              收件人 Recipient <span className="text-rose-400">*</span>
            </label>
            <input
              id="recipient"
              className="input-dark"
              placeholder="王小明"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
            {fieldError("recipient")}
          </div>
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm text-slate-400">
              手機 Phone <span className="text-rose-400">*</span>
            </label>
            <input
              id="phone"
              className="input-dark"
              placeholder="0912 345 678"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {fieldError("phone")}
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="address" className="mb-1.5 block text-sm text-slate-400">
              地址 Address <span className="text-rose-400">*</span>
            </label>
            <input
              id="address"
              className="input-dark"
              placeholder="台北市信義區未來路 2077 號 42F"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            {fieldError("address")}
          </div>
        </div>

        <h2 className="font-display mt-8 text-sm font-semibold tracking-[0.2em] text-slate-300">
          PAYMENT 付款方式
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition ${
              payment === "card"
                ? "border-cyan-400/60 bg-cyan-400/10"
                : "border-white/12 bg-white/5 hover:border-white/25"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="card"
              checked={payment === "card"}
              onChange={() => setPayment("card")}
              className="sr-only"
            />
            <CreditCard size={18} className="shrink-0 text-cyan-300" />
            <span className="text-sm font-medium">
              信用卡
              <span className="block text-xs text-slate-400">Credit Card</span>
            </span>
          </label>
          <label
            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition ${
              payment === "cod"
                ? "border-cyan-400/60 bg-cyan-400/10"
                : "border-white/12 bg-white/5 hover:border-white/25"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={payment === "cod"}
              onChange={() => setPayment("cod")}
              className="sr-only"
            />
            <Banknote size={18} className="shrink-0 text-cyan-300" />
            <span className="text-sm font-medium">
              貨到付款
              <span className="block text-xs text-slate-400">COD</span>
            </span>
          </label>
        </div>

        {payment === "card" && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="cardNumber" className="mb-1.5 block text-sm text-slate-400">
                卡號 Card Number
              </label>
              <input
                id="cardNumber"
                className="input-dark font-mono"
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                autoComplete="cc-number"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(formatCardNumber(e.target.value))
                }
              />
              {fieldError("cardNumber")}
            </div>
            <div>
              <label htmlFor="expiry" className="mb-1.5 block text-sm text-slate-400">
                到期 Expiry
              </label>
              <input
                id="expiry"
                className="input-dark font-mono"
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              />
              {fieldError("expiry")}
            </div>
            <div>
              <label htmlFor="cvc" className="mb-1.5 block text-sm text-slate-400">
                CVC
              </label>
              <input
                id="cvc"
                className="input-dark font-mono"
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
                value={cvc}
                onChange={(e) =>
                  setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                }
              />
              {fieldError("cvc")}
            </div>
            <p className="text-xs text-slate-500 sm:col-span-2">
              模擬付款 Simulated payment — 不會真的扣款，可隨意填寫。
            </p>
          </div>
        )}

        {apiError && (
          <p className="mt-5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-300">
            {apiError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-neon mt-7 w-full"
        >
          {submitting ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              處理中 Processing…
            </>
          ) : (
            <>確認下單 Place Order · {TWD(total())}</>
          )}
        </button>
      </div>

      {/* ---------- order summary ---------- */}
      <aside className="glass rounded-2xl p-6 lg:sticky lg:top-24">
        <h2 className="font-display text-sm font-semibold tracking-[0.2em] text-slate-300">
          ORDER 訂單內容
        </h2>
        <ul className="mt-5 space-y-4">
          {items.map((item) => (
            <li
              key={`${item.productId}::${item.color}`}
              className="flex items-center gap-3"
            >
              <LazyProductCanvas
                type={item.model3d}
                color={item.color || undefined}
                autoRotate
                className="h-14 w-14 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-sm font-semibold">
                  {item.nameEn}
                </p>
                <p className="text-xs text-slate-400">
                  {item.name} × {item.quantity}
                </p>
              </div>
              <span className="font-display text-sm text-cyan-300">
                {TWD(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-sm">
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">小計 Subtotal</dt>
            <dd>{TWD(total())}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-400">運費 Shipping</dt>
            <dd className="text-cyan-300">免運 Free</dd>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold">
            <dt>總計 Total</dt>
            <dd className="font-display text-gradient text-xl">
              {TWD(total())}
            </dd>
          </div>
        </dl>
      </aside>
    </form>
  );
}
