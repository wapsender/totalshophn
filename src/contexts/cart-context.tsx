'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, Product, Coupon, UserProfile } from '@/types';
import { coupons } from '@/lib/products';
import { useAuth } from './auth-context';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean, message: string};
  appliedCoupon: Coupon | null;
  discountValue: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to determine which price to use
const getAppliedPrice = (product: Product, userProfile: UserProfile | null): number => {
    if (userProfile?.role === 'reseller' && product.resellerPrice) {
        return product.resellerPrice;
    }
    return product.price;
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const { userProfile } = useAuth();

  const addItem = (product: Product) => {
    const appliedPrice = getAppliedPrice(product, userProfile);
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // In this store, we don't increase quantity, we just ensure it's in the cart
        return prevItems;
      }
      // Add the product along with the price that should be used for it
      return [...prevItems, { ...product, quantity: 1, appliedPrice }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };
  
  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };
  
  const applyCoupon = (code: string): { success: boolean, message: string} => {
    const coupon = coupons.find(c => c.code === code.toUpperCase());
    if (coupon) {
      if (coupon.uses >= coupon.quantity) {
        setAppliedCoupon(null);
        return { success: false, message: 'Este cupón ha alcanzado su límite de usos.' };
      }
      setAppliedCoupon(coupon);
      const discountText = coupon.discountType === 'percentage' ? `${coupon.value}%` : `L${coupon.value.toFixed(2)}`;
      return { success: true, message: `Obtuviste un descuento de ${discountText}.`};
    } else {
      setAppliedCoupon(null);
      return { success: false, message: 'El código de cupón que ingresaste no es válido.' };
    }
  };

  const subtotal = items.reduce((total, item) => total + item.appliedPrice * item.quantity, 0);
  let discountValue = 0;
  if (appliedCoupon) {
      if(appliedCoupon.discountType === 'percentage') {
        discountValue = subtotal * (appliedCoupon.value / 100);
      } else {
        discountValue = appliedCoupon.value;
      }
  }

  const totalPrice = Math.max(0, subtotal - discountValue);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, applyCoupon, appliedCoupon, discountValue, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
