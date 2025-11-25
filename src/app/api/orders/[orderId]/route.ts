import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';

export async function PATCH(
    request: Request,
    { params }: { params: { orderId: string } }
) {
    try {
        const { orderId } = params;
        const body = await request.json();
        const { userId, status } = body;

        if (!userId || !status) {
            return NextResponse.json({ error: 'userId and status are required' }, { status: 400 });
        }

        // Verify order belongs to user
        const verifyResult = await executeQuery<{ USUARIO_ID: number }>(
            `SELECT USUARIO_ID FROM APP_OWNER.PEDIDOS WHERE ID = :orderId`,
            { orderId: parseInt(orderId) }
        );

        if (!verifyResult.rows || verifyResult.rows.length === 0) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (verifyResult.rows[0].USUARIO_ID?.toString() !== userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Map status to Spanish if needed
        let targetStatus = status;
        if (status === 'cancelled' || status === 'canceled') {
            targetStatus = 'cancelado';
        }

        // Validate status
        const validStatuses = ['pendiente', 'confirmado', 'enviado', 'entregado', 'cancelado', 'pagado'];
        if (!validStatuses.includes(targetStatus)) {
            return NextResponse.json({
                error: `Invalid status. Allowed values: ${validStatuses.join(', ')}`
            }, { status: 400 });
        }

        if (targetStatus === 'cancelado') {
            // 1. Get order items to restore stock
            const itemsResult = await executeQuery<{ PRODUCTO_ID: number; VARIANTE_ID: number; CANTIDAD: number }>(
                `SELECT PRODUCTO_ID, VARIANTE_ID, CANTIDAD 
                 FROM APP_OWNER.DETALLE_PEDIDOS 
                 WHERE PEDIDO_ID = :orderId`,
                { orderId: parseInt(orderId) }
            );

            // 2. Restore stock for each item
            if (itemsResult.rows && itemsResult.rows.length > 0) {
                for (const item of itemsResult.rows) {
                    if (item.VARIANTE_ID) {
                        await executeQuery(
                            `UPDATE APP_OWNER.SALDOS_INVENTARIO 
                             SET EXISTENCIA = EXISTENCIA + :quantity 
                             WHERE VARIANTE_PRODUCTO_ID = :variantId`,
                            { quantity: item.CANTIDAD, variantId: item.VARIANTE_ID }
                        );
                    }
                }
            }
        }

        // Update order status
        await executeQuery(
            `UPDATE APP_OWNER.PEDIDOS SET ESTADO = :status, ACTUALIZADO_EN = CURRENT_TIMESTAMP WHERE ID = :orderId`,
            { status: targetStatus, orderId: parseInt(orderId) }
        );

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
