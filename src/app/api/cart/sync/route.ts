import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';
import oracledb from 'oracledb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, items } = body;

        console.log(`🔄 Syncing cart for user ${userId} with ${items?.length} items...`);

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const parsedUserId = parseInt(userId);
        if (isNaN(parsedUserId)) {
            console.error(`❌ Invalid userId format: ${userId}`);
            return NextResponse.json({ error: 'Invalid User ID format' }, { status: 400 });
        }

        // 1. Get or Create Cart ID
        const cartResult = await executeQuery<{ p_cart_id: number }>(
            `BEGIN
                APP_OWNER.SP_CREAR_O_FUSIONAR_CARRITO(
                    p_perfil_id         => :p_user_id,
                    p_token_sesion      => NULL,
                    p_carrito_id        => :p_cart_id,
                    p_fusionado         => :p_merged,
                    p_carrito_previo_id => :p_prev_id
                );
             END;`,
            {
                p_user_id: parsedUserId,
                p_cart_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
                p_merged: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
                p_prev_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
            }
        );

        const cartId = cartResult.outBinds?.p_cart_id;
        if (!cartId) throw new Error('Failed to get cart ID from stored procedure');

        // 2. Clear existing items
        await executeQuery(
            `DELETE FROM APP_OWNER.CART_ITEMS WHERE CARRITO_ID = :cartId`,
            { cartId }
        );

        // 3. Insert new items
        // Direct insert into CART_ITEMS to avoid stock check blocking the sync.

        if (items && items.length > 0) {
            for (const item of items) {
                let productId: number | null = null;
                let varianteId: number | null = null;

                // CartItem has productId and variantId as strings (e.g., "v_123" or "p_456")
                const itemVariantId = item.variantId;
                const itemProductId = item.productId;

                // Parse variantId (e.g., "v_123" -> 123)
                if (itemVariantId && typeof itemVariantId === 'string') {
                    if (itemVariantId.startsWith('v_')) {
                        varianteId = parseInt(itemVariantId.substring(2));
                    } else {
                        varianteId = parseInt(itemVariantId);
                    }

                    // Get Product ID from variant if not provided
                    if (varianteId && !isNaN(varianteId)) {
                        const varRes = await executeQuery<{ PRODUCTO_ID: number }>(
                            `SELECT PRODUCTO_ID FROM APP_OWNER.VARIANTES_PRODUCTO WHERE ID = :vid`,
                            { vid: varianteId }
                        );
                        if (varRes.rows?.[0]) productId = varRes.rows[0].PRODUCTO_ID;
                    }
                }

                // Parse productId if not yet set (e.g., "p_456" -> 456)
                if (!productId && itemProductId && typeof itemProductId === 'string') {
                    if (itemProductId.startsWith('p_')) {
                        productId = parseInt(itemProductId.substring(2));
                    } else {
                        productId = parseInt(itemProductId);
                    }
                }

                if (productId && !isNaN(productId)) {
                    await executeQuery(
                        `INSERT INTO APP_OWNER.CART_ITEMS (CARRITO_ID, PRODUCTO_ID, VARIANTE_ID, CANTIDAD, PRECIO_UNITARIO_OBSERVADO)
                        VALUES (:cartId, :prodId, :varId, :qty, :price)`,
                        {
                            cartId,
                            prodId: productId,
                            varId: varianteId,
                            qty: item.quantity,
                            price: item.price
                        }
                    );
                } else {
                    console.warn(`⚠️ Could not parse item: productId=${itemProductId}, variantId=${itemVariantId}`);
                }
            }
        }

        // Update timestamp
        await executeQuery(
            `UPDATE APP_OWNER.CARRITOS SET ACTUALIZADO_EN = SYSTIMESTAMP WHERE ID = :cartId`,
            { cartId }
        );

        // Optional: Return current coupon if any
        const cartInfo = await executeQuery<{ CUPON_ID: number }>(
            `SELECT CUPON_ID FROM APP_OWNER.CARRITOS WHERE ID = :cartId`,
            { cartId }
        );

        const couponId = cartInfo.rows?.[0]?.CUPON_ID;

        return NextResponse.json({ success: true, cartId, couponId });

    } catch (error: any) {
        console.error('Cart sync error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
