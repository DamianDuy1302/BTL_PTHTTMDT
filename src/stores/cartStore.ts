import { removeSpaces } from "@/utils/functions";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type CartState = {
  items: any[];
  reRenderCart: number;
  addItem: (product: any, quantity: any) => void;
  minusItem: (product: any) => void;
  removeItem: (product: any) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      reRenderCart: 1,
      addItem: (product, quantity) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.id === product.id &&
              removeSpaces(Object.values(item.options).join(", ")) ===
                removeSpaces(Object.values(product.options).join(", "))
          );
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === product.id &&
                removeSpaces(Object.values(item.options).join(", ")) ===
                  removeSpaces(Object.values(product.options).join(", "))
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            return { items: [...state.items, { ...product, quantity }] };
          }
        }),

      minusItem: (product) =>
        set((state) => ({
          items: state.items
            .map((item) =>
              item.id === product.id &&
              removeSpaces(Object.values(item.options).join(", ")) ===
                removeSpaces(Object.values(product.options).join(", ")) &&
              item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0),
        })),

      removeItem: (product) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === product.id &&
                removeSpaces(Object.values(item.options).join(", ")) ===
                  removeSpaces(Object.values(product.options).join(", "))
              )
          ),
          reRenderCart: state.reRenderCart + 1,
        }));
      },

      clearCart: () => set({ items: [] }),
    }),

    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
