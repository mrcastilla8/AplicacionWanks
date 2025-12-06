'use client';

import Image from 'next/image';
import type { ProductWithVariants } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Eye } from 'lucide-react';
import { useLocale } from '@/context/locale-context';
import { useWishlist } from '@/context/wishlist-context';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithVariants;
  priority?: boolean;
  onSelect: (product: ProductWithVariants) => void;
}

export function ProductCard({ product, priority = false, onSelect }: ProductCardProps) {
  const { translations } = useLocale();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const inWishlist = isInWishlist(parseInt(product.id));

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWishlist) {
      await removeFromWishlist(parseInt(product.id));
    } else {
      // Create a compatible object for the wishlist
      const wishlistProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.variants[0]?.price || 0,
        imageUrl: product.imageUrl,
        category: product.category,
        stock: product.variants.reduce((sum, v) => sum + v.stock, 0)
      };
      await addToWishlist(wishlistProduct);
    }
  };

  // Calculate total stock across all variants
  const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
  const hasAnyStock = totalStock > 0;

  // Get min price from variants
  const minPrice = Math.min(...product.variants.map(v => v.price));
  const maxPrice = Math.max(...product.variants.map(v => v.price));
  const hasMultiplePrices = minPrice !== maxPrice;

  const handleCardClick = () => {
    onSelect(product);
  };

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 ease-in-out h-full cursor-pointer group",
        "hover:shadow-xl hover:scale-[1.02] hover:border-primary/50",
        !hasAnyStock && "opacity-70"
      )}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="aspect-video relative w-full overflow-hidden">
          <Image
            src={product.imageUrl || 'https://placehold.co/600x400.png'}
            alt={product.name}
            data-ai-hint="product item merchandise"
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background text-foreground transition-colors z-10"
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={cn("h-5 w-5 transition-colors", inWishlist ? "fill-red-500 text-red-500" : "text-foreground")} />
          </button>

          {/* View options overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-foreground font-medium">
              <Eye className="h-4 w-4" />
              {translations.variantSelector?.viewOptions || 'Ver opciones'}
            </div>
          </div>

          {/* Out of stock badge */}
          {!hasAnyStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
                {translations.productPage.outOfStock}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="font-headline text-xl mb-1 truncate" title={product.name}>
          {product.name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-2 h-10 overflow-hidden text-ellipsis line-clamp-2">
          {product.description || `${product.variants.length} presentaciones disponibles`}
        </CardDescription>
        <div className="mt-auto flex items-center justify-between">
          <div>
            {hasMultiplePrices ? (
              <p className="text-lg font-semibold text-primary">
                Desde {translations.common.currencySymbol}{minPrice.toFixed(2)}
              </p>
            ) : (
              <p className="text-lg font-semibold text-primary">
                {translations.common.currencySymbol}{minPrice.toFixed(2)}
              </p>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {product.variants.length} {product.variants.length === 1 ? 'opción' : 'opciones'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
