'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { ProductWithVariants, ProductVariant } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import { useLocale } from '@/context/locale-context';
import { ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VariantSelectorModalProps {
    product: ProductWithVariants | null;
    isOpen: boolean;
    onClose: () => void;
}

export function VariantSelectorModal({ product, isOpen, onClose }: VariantSelectorModalProps) {
    const { addToCart } = useCart();
    const { translations } = useLocale();
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
    const [quantity, setQuantity] = useState('1');

    if (!product) return null;

    const selectedVariant = product.variants.find(v => v.id === selectedVariantId);
    const hasAnyStock = product.variants.some(v => v.stock > 0);

    // Auto-select first available variant if none selected
    if (!selectedVariantId && hasAnyStock) {
        const firstAvailable = product.variants.find(v => v.stock > 0);
        if (firstAvailable) {
            setSelectedVariantId(firstAvailable.id);
        }
    }

    const handleQuantityChange = (value: string) => {
        setQuantity(value);
    };

    const handleBlur = () => {
        const num = Math.floor(parseFloat(quantity));
        const maxStock = selectedVariant?.stock || 1;
        if (isNaN(num) || num < 1) {
            setQuantity('1');
        } else if (num > maxStock) {
            setQuantity(String(maxStock));
        } else {
            setQuantity(String(num));
        }
    };

    const handleAddToCart = () => {
        if (!selectedVariant || selectedVariant.stock <= 0) return;

        const numQuantity = Math.max(1, Math.floor(parseFloat(quantity) || 1));
        addToCart(product, selectedVariant, numQuantity);
        onClose();
        // Reset state for next opening
        setQuantity('1');
        setSelectedVariantId(null);
    };

    const numQuantity = parseFloat(quantity);
    const isInvalidQuantity = isNaN(numQuantity) || numQuantity < 1 || !Number.isInteger(numQuantity) ||
        (selectedVariant && numQuantity > selectedVariant.stock);
    const isAddDisabled = !selectedVariant || selectedVariant.stock <= 0 || isInvalidQuantity;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl">{product.name}</DialogTitle>
                    {product.description && (
                        <DialogDescription className="text-muted-foreground">
                            {product.description}
                        </DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-6">
                    {/* Product Image */}
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <Image
                            src={product.imageUrl || 'https://placehold.co/600x400.png'}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 500px"
                        />
                    </div>

                    {/* Variants Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            {translations.variantSelector?.selectVariant || 'Selecciona una presentación'}
                        </Label>

                        {!hasAnyStock ? (
                            <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 text-destructive">
                                <AlertTriangle className="h-5 w-5" />
                                <span>{translations.productPage.outOfStock}</span>
                            </div>
                        ) : (
                            <RadioGroup
                                value={selectedVariantId || ''}
                                onValueChange={setSelectedVariantId}
                                className="space-y-2"
                            >
                                {product.variants.map((variant) => {
                                    const isOutOfStock = variant.stock <= 0;
                                    const isLowStock = variant.stock > 0 && variant.stock < 5;

                                    return (
                                        <Label
                                            key={variant.id}
                                            htmlFor={variant.id}
                                            className={cn(
                                                "flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all",
                                                selectedVariantId === variant.id && !isOutOfStock
                                                    ? "border-primary ring-2 ring-primary bg-primary/5"
                                                    : "hover:border-primary/50",
                                                isOutOfStock && "opacity-50 cursor-not-allowed bg-muted/50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <RadioGroupItem
                                                    value={variant.id}
                                                    id={variant.id}
                                                    disabled={isOutOfStock}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{variant.name}</span>
                                                    {isOutOfStock ? (
                                                        <span className="text-xs text-destructive">
                                                            {translations.productPage.outOfStock}
                                                        </span>
                                                    ) : isLowStock ? (
                                                        <span className="text-xs text-amber-600">
                                                            {translations.productPage.onlyLeft.replace('{stock}', variant.stock.toString())}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">
                                                            {variant.stock} {translations.variantSelector?.inStock || 'disponibles'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="font-semibold text-lg text-primary">
                                                {translations.common.currencySymbol}{variant.price.toFixed(2)}
                                            </span>
                                        </Label>
                                    );
                                })}
                            </RadioGroup>
                        )}
                    </div>

                    {/* Quantity and Add to Cart */}
                    {hasAnyStock && selectedVariant && (
                        <div className="flex items-center gap-3 pt-4 border-t">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="quantity" className="text-sm font-medium">
                                    {translations.common.quantity}:
                                </Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQuantityChange(e.target.value)}
                                    onBlur={handleBlur}
                                    min="1"
                                    max={selectedVariant.stock}
                                    className="w-20 text-center"
                                />
                            </div>
                            <Button
                                onClick={handleAddToCart}
                                disabled={isAddDisabled}
                                className="flex-1 gap-2"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {translations.buttons.addToCart}
                            </Button>
                        </div>
                    )}

                    {/* Selected Price Summary */}
                    {selectedVariant && selectedVariant.stock > 0 && (
                        <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                            <span className="text-sm text-muted-foreground">
                                {translations.common.subtotal}:
                            </span>
                            <span className="text-xl font-bold text-primary">
                                {translations.common.currencySymbol}
                                {(selectedVariant.price * (parseInt(quantity) || 1)).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
