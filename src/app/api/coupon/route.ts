import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';
import oracledb from 'oracledb';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { cartId, couponCode } = body;

        // Validaciones básicas de entrada
        if (!cartId || !couponCode) {
            return NextResponse.json(
                { error: 'Se requiere cartId y couponCode' },
                { status: 400 }
            );
        }

        console.log(`🎟️ Intentando aplicar cupón [${couponCode}] al carrito ${cartId}...`);

        const query = `
            BEGIN
                APP_OWNER.PKG_CUPONES.SP_APLICAR_CUPON(
                    p_carrito_id    => :p_cart_id,
                    p_codigo_cupon  => :p_code,
                    p_resultado     => :p_result,
                    p_descuento_est => :p_discount
                );
            END;
        `;

        const params = {
            p_cart_id: cartId,
            p_code: couponCode,
            p_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
            p_discount: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };

        const result: any = await executeQuery(query, params);

        const mensajeSalida = result.outBinds?.p_result;
        const descuentoEstimado = result.outBinds?.p_discount;

        if (mensajeSalida === 'OK') {
            console.log(`✅ Cupón aplicado. Descuento: ${descuentoEstimado}`);
            return NextResponse.json({
                success: true,
                message: 'Cupón aplicado correctamente',
                discount: descuentoEstimado
            });
        } else {
            console.warn(`⚠️ Cupón rechazado: ${mensajeSalida}`);
            return NextResponse.json({
                success: false,
                message: mensajeSalida
            }, { status: 400 });
        }

    } catch (error: any) {
        console.error('❌ Error crítico aplicando cupón:', error);
        return NextResponse.json({
            error: 'Error interno del servidor al procesar el cupón',
            details: error.message
        }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { cartId } = body;

        if (!cartId) {
            return NextResponse.json({ error: 'Se requiere cartId' }, { status: 400 });
        }

        console.log(`🗑️ Removiendo cupón del carrito ${cartId}...`);

        const query = `
            BEGIN
                APP_OWNER.PKG_CUPONES.SP_REMOVER_CUPON(
                    p_carrito_id => :p_cart_id,
                    p_resultado  => :p_result
                );
            END;
        `;

        const params = {
            p_cart_id: cartId,
            p_result: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        };

        const result: any = await executeQuery(query, params);
        const mensajeSalida = result.outBinds?.p_result;

        if (mensajeSalida === 'OK') {
            return NextResponse.json({ success: true, message: 'Cupón removido exitosamente' });
        } else {
            return NextResponse.json({ success: false, message: mensajeSalida }, { status: 400 });
        }

    } catch (error: any) {
        console.error('❌ Error removiendo cupón:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
