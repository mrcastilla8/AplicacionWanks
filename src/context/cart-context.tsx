'use client';

import type { CartItem, ProductWithVariants, ProductVariant } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useLocale } from './locale-context';


interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: ProductWithVariants, variant: ProductVariant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { toast } = useToast();
  const { translations } = useLocale();


  useEffect(() => {
    try {
      // Clear old cart format if exists
      localStorage.removeItem('wankas-cart');

      const storedCart = localStorage.getItem('wankas-cart-v2');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Filter out items that don't have the new structure (variantId is required)
        const validItems = Array.isArray(parsedCart)
          ? parsedCart.filter((item: any) => item && item.variantId && item.productId && item.name)
          : [];
        setCartItems(validItems);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      localStorage.removeItem('wankas-cart-v2');
    } finally {
      setIsCartLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('wankas-cart-v2', JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded]);

  const addToCart = (product: ProductWithVariants, variant: ProductVariant, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.variantId === variant.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.variantId === variant.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      const newItem: CartItem = {
        productId: product.id,
        variantId: variant.id,
        name: `${product.name} - ${variant.name}`,
        variantName: variant.name,
        price: variant.price,
        imageUrl: product.imageUrl,
        quantity
      };
      return [...prevItems, newItem];
    });
    toast({
      title: translations.myPantryPage.addedToCartTitle,
      description: translations.myPantryPage.addedToCartDesc.replace('{productName}', `${product.name} - ${variant.name}`)
    });
  };

  const removeFromCart = (variantId: string) => {
    const removedItem = cartItems.find(item => item.variantId === variantId);
    setCartItems(prevItems => prevItems.filter(item => item.variantId !== variantId));
    if (removedItem) {
      toast({
        title: translations.myPantryPage.removedFromCartTitle,
        description: translations.myPantryPage.removedFromCartDesc
      });
    }
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.variantId === variantId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast({
      title: translations.myPantryPage.cartClearedTitle,
      description: translations.myPantryPage.cartClearedDesc
    });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
