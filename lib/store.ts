"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  nameEn: string;
  price: number;
  model3d: string;
  color: string;
  quantity: number;
};

type AddInput = Omit<CartItem, "quantity">;

type CartState = {
  items: CartItem[];
  add: (item: AddInput, qty?: number) => void;
  remove: (productId: string, color: string) => void;
  setQty: (productId: string, color: string, qty: number) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
};

const keyOf = (productId: string, color: string) => `${productId}::${color}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((state) => {
          const key = keyOf(item.productId, item.color);
          const existing = state.items.find(
            (i) => keyOf(i.productId, i.color) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                keyOf(i.productId, i.color) === key
                  ? { ...i, quantity: i.quantity + qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: qty }] };
        }),
      remove: (productId, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => keyOf(i.productId, i.color) !== keyOf(productId, color)
          ),
        })),
      setQty: (productId, color, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter(
                  (i) => keyOf(i.productId, i.color) !== keyOf(productId, color)
                )
              : state.items.map((i) =>
                  keyOf(i.productId, i.color) === keyOf(productId, color)
                    ? { ...i, quantity: qty }
                    : i
                ),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      total: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),
    }),
    { name: "godshop-cart" }
  )
);
