'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types';

interface WishlistItem {
    id: number; // WISHLIST_ITEM_ID
    productId: number;
    variantId: number | null;
    name: string;
    price: number;
    image: string;
    addedAt: Date;
}

interface WishlistContextType {
    items: WishlistItem[];
    addToWishlist: (product: Product) => Promise<void>;
    removeFromWishlist: (productId: number, variantId?: number | null) => Promise<void>;
    isInWishlist: (productId: number, variantId?: number | null) => boolean;
    isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();

    const fetchWishlist = useCallback(async () => {
        if (!user) {
            setItems([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`/api/wishlist?userId=${user.id}`);
            if (response.ok) {
                const data = await response.json();
                setItems(data);
            } else {
                console.error('Failed to fetch wishlist');
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (product: Product) => {
        if (!user) {
            toast({
                title: "Inicia sesión",
                description: "Debes iniciar sesión para guardar en tu lista de deseos.",
                variant: "destructive",
            });
            return;
        }

        // Optimistic update (optional, but let's wait for server for safety first or do optimistic)
        // Let's do server first to ensure DB integrity
        try {
            const response = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    productId: product.id,
                    variantId: null // Assuming simple products for now, adapt if product has variants
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Añadido a la lista de deseos",
                    description: `${product.name} se ha guardado.`,
                });
                fetchWishlist(); // Refresh list
            } else {
                toast({
                    title: "Error",
                    description: data.message || "No se pudo agregar a la lista.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error adding to wishlist:', error);
            toast({
                title: "Error",
                description: "Ocurrió un error al conectar con el servidor.",
                variant: "destructive",
            });
        }
    };

    const removeFromWishlist = async (productId: number, variantId: number | null = null) => {
        if (!user) return;

        try {
            const response = await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    productId: productId,
                    variantId: variantId
                }),
            });

            if (response.ok) {
                setItems(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
                toast({
                    title: "Eliminado",
                    description: "Producto eliminado de tu lista de deseos.",
                });
            } else {
                toast({
                    title: "Error",
                    description: "No se pudo eliminar de la lista.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
        }
    };

    const isInWishlist = (productId: number, variantId: number | null = null) => {
        return items.some(item => item.productId == productId && item.variantId == variantId);
    };

    return (
        <WishlistContext.Provider value={{ items, addToWishlist, removeFromWishlist, isInWishlist, isLoading }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
