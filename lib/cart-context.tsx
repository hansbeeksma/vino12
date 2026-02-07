"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const BOX_PRICE = 175;

interface CartState {
  quantity: number;
  total: number;
  isOpen: boolean;
}

interface CartContextType extends CartState {
  addBox: () => void;
  removeBox: () => void;
  setQuantity: (qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [quantity, setQuantityState] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("vino12-cart");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed.quantity === "number") {
        setQuantityState(parsed.quantity);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("vino12-cart", JSON.stringify({ quantity }));
  }, [quantity]);

  const addBox = useCallback(() => {
    setQuantityState((q) => q + 1);
    setIsOpen(true);
  }, []);

  const removeBox = useCallback(() => {
    setQuantityState((q) => Math.max(0, q - 1));
  }, []);

  const setQuantity = useCallback((qty: number) => {
    setQuantityState(Math.max(0, qty));
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((o) => !o), []);

  return (
    <CartContext.Provider
      value={{
        quantity,
        total: quantity * BOX_PRICE,
        isOpen,
        addBox,
        removeBox,
        setQuantity,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
