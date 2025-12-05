import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';
import { CartItem } from '@/types';

// GET handler for fetching user orders
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        // Fetch orders for the user
        const ordersResult = await executeQuery<any>(
            `SELECT ID, USUARIO_ID, LOCAL_ID, FECHA_PEDIDO, FECHA_RETIRO, TOTAL_PRECIO, ESTADO, CREADO_EN
             FROM APP_OWNER.PEDIDOS
             WHERE USUARIO_ID = :userId
             ORDER BY CREADO_EN DESC`,
            { userId: parseInt(userId) }
        );

        if (!ordersResult.rows || ordersResult.rows.length === 0) {
            return NextResponse.json([]);
        }

        // Enrich each order with its items and details
        const enrichedOrders = await Promise.all(
            ordersResult.rows.map(async (order) => {
                // Fetch order items with product images
                const itemsResult = await executeQuery<any>(
                    `SELECT dp.PEDIDO_ID, dp.PRODUCTO_ID, dp.VARIANTE_ID, dp.CANTIDAD, dp.PRECIO_UNITARIO,
                            COALESCE(vp.PRECIO_SOBRESCRITO, p.PRECIO) as PRECIO_ORIGINAL,
                            TO_CHAR(p.NOMBRE_ES) || (CASE WHEN vp.NOMBRE_ES IS NOT NULL THEN ' ' || TO_CHAR(vp.NOMBRE_ES) ELSE '' END) as PRODUCT_NAME,
                            (SELECT ma.URL 
                             FROM APP_OWNER.MEDIO_PRODUCTO mp
                             JOIN APP_OWNER.MEDIO_ARCHIVO ma ON mp.MEDIO_ID = ma.ID
                             WHERE mp.PRODUCTO_ID = dp.PRODUCTO_ID
                               AND (mp.VARIANTE_ID = dp.VARIANTE_ID OR (mp.VARIANTE_ID IS NULL AND dp.VARIANTE_ID IS NULL))
                               AND mp.ES_PORTADA = 'S'
                             ORDER BY mp.VARIANTE_ID DESC NULLS LAST
                             FETCH FIRST 1 ROWS ONLY) as PRODUCT_IMAGE
                     FROM APP_OWNER.DETALLE_PEDIDOS dp
                     LEFT JOIN APP_OWNER.PRODUCTOS p ON dp.PRODUCTO_ID = p.ID
                     LEFT JOIN APP_OWNER.VARIANTES_PRODUCTO vp ON dp.VARIANTE_ID = vp.ID
                     WHERE dp.PEDIDO_ID = :orderId`,
                    { orderId: order.ID }
                );

                // Fetch location details
                const locationResult = await executeQuery<any>(
                    `SELECT TO_CHAR(NOMBRE_ES) as NOMBRE_ES, TO_CHAR(DIRECCION) as DIRECCION 
                     FROM APP_OWNER.LOCALES 
                     WHERE ID = :locId`,
                    { locId: order.LOCAL_ID }
                );

                const items = (itemsResult.rows || []).map((item: any) => ({
                    order_id: item.PEDIDO_ID?.toString() || '',
                    product_id: item.PRODUCTO_ID?.toString() || item.VARIANTE_ID?.toString() || '',
                    quantity: item.CANTIDAD || 0,
                    price_at_purchase: item.PRECIO_ORIGINAL || item.PRECIO_UNITARIO || 0, // Using original list price for display
                    paid_price: item.PRECIO_UNITARIO || 0,
                    productName: item.PRODUCT_NAME || 'Unknown Product',
                    productImageUrl: item.PRODUCT_IMAGE || ''
                }));

                return {
                    id: order.ID?.toString() || '',
                    user_id: order.USUARIO_ID?.toString() || '',
                    location_id: order.LOCAL_ID?.toString() || '',
                    order_date: order.FECHA_PEDIDO?.toISOString() || '',
                    pickup_date: order.FECHA_RETIRO?.toISOString() || '',
                    status: order.ESTADO || 'pending',
                    total_price: order.TOTAL_PRECIO || 0,
                    created_at: order.CREADO_EN?.toISOString() || '',
                    items,
                    location_name: locationResult.rows?.[0]?.NOMBRE_ES || '',
                    location_address: locationResult.rows?.[0]?.DIRECCION || ''
                };
            })
        );

        return NextResponse.json(enrichedOrders);
    } catch (error: any) {
        console.error('Error fetching user orders:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { orderData, cartItems } = body;

        // Convert IDs to numbers
        const userId = parseInt(orderData.user_id);
        const locationId = parseInt(orderData.location_id);
        const totalPrice = parseFloat(orderData.total_price);

        // 1. Insert Order (without RETURNING INTO to avoid bind issues)
        await executeQuery(
            `INSERT INTO APP_OWNER.PEDIDOS (USUARIO_ID, LOCAL_ID, FECHA_RETIRO, TOTAL_PRECIO, ESTADO)
             VALUES (:userId, :locationId, :pickupDate, :totalPrice, :estado)`,
            {
                userId,
                locationId,
                pickupDate: new Date(orderData.pickup_date),
                totalPrice,
                estado: 'pendiente'
            }
        );

        // 2. Get the inserted order ID
        const orderIdResult = await executeQuery<{ ID: number }>(
            `SELECT ID FROM APP_OWNER.PEDIDOS 
             WHERE USUARIO_ID = :p_user_id 
             AND TOTAL_PRECIO = :p_price
             AND ESTADO = :p_estado
             ORDER BY ID DESC 
             FETCH FIRST 1 ROWS ONLY`,
            { p_user_id: userId, p_price: totalPrice, p_estado: 'pendiente' }
        );

        if (!orderIdResult.rows || orderIdResult.rows.length === 0) {
            throw new Error('Failed to retrieve Order ID');
        }

        const orderId = orderIdResult.rows[0].ID;
        console.log('📦 Order created with ID:', orderId);
        console.log('📋 Cart items received:', JSON.stringify(cartItems, null, 2));

        // 1.5 Redeem Coupon if present
        const cartId = orderData.cart_id;
        if (cartId) {
            console.log(`🎟️ Checking for coupon on cart ${cartId}...`);
            try {
                await executeQuery(`
                    DECLARE
                    v_cupon_id NUMBER;
                    BEGIN
                    SELECT cupon_id INTO v_cupon_id FROM APP_OWNER.CARRITOS WHERE id = :p_cart_id;
                    IF v_cupon_id IS NOT NULL THEN
                        INSERT INTO APP_OWNER.REDENCIONES_CUPONES (USUARIO_ID, PEDIDO_ID, CUPON_ID, REDIMIDO_EN)
                        VALUES (:p_user_id, :p_order_id, v_cupon_id, SYSTIMESTAMP);

                        -- Mark cart as closed
                        UPDATE APP_OWNER.CARRITOS SET CUPON_ID = NULL, ESTADO = 'cerrado', ACTUALIZADO_EN = SYSTIMESTAMP 
                        WHERE ID = :p_cart_id;
                    END IF;
                    EXCEPTION
                    WHEN OTHERS THEN NULL; -- Fail silently to ensure order is not rolled back if coupon fails? Or log?
                    END;
                `, { p_cart_id: cartId, p_user_id: userId, p_order_id: orderId });
                console.log('  ✅ Coupon process handled');
            } catch (cErr) {
                console.warn("  ⚠️ Failed to redeem coupon:", cErr);
            }
        }

        // 2. Insert Items and Update Stock
        // Calculate discount factor to apply to unit prices
        // ensuring the DB trigger sums them up to the target discounted total
        const originalCartTotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const targetTotal = typeof orderData.total_price === 'number' ? orderData.total_price : parseFloat(orderData.total_price);

        let discountFactor = 1;
        if (originalCartTotal > 0 && targetTotal < originalCartTotal) {
            discountFactor = targetTotal / originalCartTotal;
        }

        console.log(`📉 Applying discount factor: ${discountFactor} (Original: ${originalCartTotal}, Target: ${targetTotal})`);

        for (const item of cartItems as CartItem[]) {
            console.log('🔍 Processing item:', item.id, item.name);
            let productId: number | null = null;
            let varianteId: number | null = null;

            // Calculate net price for this item
            const originalPrice = item.price;
            const netPrice = originalPrice * discountFactor;

            if (item.id.startsWith('v_')) {
                varianteId = parseInt(item.id.substring(2));
                console.log('  ✓ Variant ID:', varianteId);
                // Get Product ID for this variant
                const varResult = await executeQuery<{ PRODUCTO_ID: number }>(
                    `SELECT PRODUCTO_ID FROM APP_OWNER.VARIANTES_PRODUCTO WHERE ID = :p_variant_id`,
                    { p_variant_id: varianteId }
                );
                if (varResult.rows && varResult.rows.length > 0) {
                    productId = varResult.rows[0].PRODUCTO_ID;
                    console.log('  ✓ Product ID from variant:', productId);
                } else {
                    console.warn('  ⚠️ No product found for variant:', varianteId);
                }
            } else if (item.id.startsWith('p_')) {
                productId = parseInt(item.id.substring(2));
                console.log('  ✓ Product ID:', productId);
            } else {
                console.error('  ❌ Invalid item ID format:', item.id);
                continue;
            }

            // Insert Detail
            console.log('  💾 Inserting order detail:', { orderId, productId, varianteId, quantity: item.quantity, price: netPrice });
            await executeQuery(
                `INSERT INTO APP_OWNER.DETALLE_PEDIDOS (PEDIDO_ID, PRODUCTO_ID, VARIANTE_ID, CANTIDAD, PRECIO_UNITARIO)
                 VALUES (:p_order_id, :p_product_id, :p_variant_id, :p_quantity, :p_price)`,
                {
                    p_order_id: orderId,
                    p_product_id: productId,
                    p_variant_id: varianteId,
                    p_quantity: item.quantity,
                    p_price: netPrice // Use calculated net price
                }
            );
            console.log('  ✅ Order detail inserted successfully');

            // Update Stock (only if variant exists)
            if (varianteId) {
                console.log('  📉 Updating stock for variant:', varianteId);
                await executeQuery(
                    `UPDATE APP_OWNER.SALDOS_INVENTARIO 
                     SET EXISTENCIA = EXISTENCIA - :p_quantity 
                     WHERE VARIANTE_PRODUCTO_ID = :p_variant_id`,
                    {
                        p_quantity: item.quantity,
                        p_variant_id: varianteId
                    }
                );
            }
        }

        return NextResponse.json({ success: true, orderId });

    } catch (error: any) {
        console.error('Error placing order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
