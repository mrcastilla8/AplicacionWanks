'use client';

import { useWishlist } from '@/context/wishlist-context';
import { useCart } from '@/context/cart-context';
import { useLocale } from '@/context/locale-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShoppingCart, PackageSearch } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader } from '@/components/ui/loader';

export default function WishlistPage() {
    const { items, removeFromWishlist, isLoading } = useWishlist();
    const { addToCart } = useCart();
    const { translations } = useLocale();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
                <Loader text={translations.common.loading} size={48} />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12 space-y-4">
                <PackageSearch className="mx-auto h-24 w-24 text-muted-foreground" />
                <h2 className="font-headline text-2xl font-semibold text-foreground">Tu lista de deseos está vacía</h2>
                <p className="text-muted-foreground">
                    Explora nuestros productos y guarda tus favoritos aquí.
                </p>
                <Button asChild className="mt-4">
                    <Link href="/products">{translations.buttons.startShopping}</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="text-center space-y-2">
                <h1 className="font-headline text-4xl font-bold text-primary">{translations.nav.wishlist}</h1>
                <p className="text-lg text-muted-foreground">Tus productos favoritos guardados para después.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <Card key={item.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out h-full">
                        <CardHeader className="p-0">
                            <div className="aspect-video relative w-full overflow-hidden">
                                <Image
                                    src={item.image || 'https://placehold.co/600x400.png'}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 flex-grow flex flex-col">
                            <CardTitle className="font-headline text-xl mb-1 truncate" title={item.name}>{item.name}</CardTitle>
                            <div className="mt-auto">
                                <p className="text-lg font-semibold text-primary">
                                    {translations.common.currencySymbol}{item.price.toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Agregado el {new Date(item.addedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="p-4 border-t bg-card grid grid-cols-2 gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromWishlist(item.productId, item.variantId)}
                                className="w-full"
                                aria-label="Eliminar de la lista"
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Borrar
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => {
                                    // Reconstruct product object for cart
                                    addToCart({
                                        id: item.productId.toString(),
                                        name: item.name,
                                        price: item.price,
                                        imageUrl: item.image,
                                        description: '', // Not needed for cart logic usually, or fetch if needed
                                        category: '',
                                        stock: 999 // Assumption: in stock if in wishlist, or handle stock check
                                    }, 1);
                                    // Optional: remove from wishlist after adding to cart?
                                    // removeFromWishlist(item.productId, item.variantId); 
                                }}
                                className="w-full"
                                aria-label="Agregar al carrito"
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" /> Agregar
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
