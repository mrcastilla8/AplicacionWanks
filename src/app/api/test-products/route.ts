import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';

export async function GET() {
    try {
        console.log('🧪 Probando query de productos...');

        // Primero, probar si existe la vista
        try {
            const viewCheck = await executeQuery(
                `SELECT COUNT(*) as CNT FROM APP_OWNER.VW_CATALOGO_PRODUCTOS WHERE ROWNUM <= 1`
            );
            console.log('✅ Vista VW_CATALOGO_PRODUCTOS existe');
        } catch (viewError: any) {
            console.error('La vista VW_CATALOGO_PRODUCTOS no existe:', viewError.message);
            return NextResponse.json({
                success: false,
                error: 'VIEW_NOT_FOUND',
                message: 'La vista VW_CATALOGO_PRODUCTOS no existe',
                details: viewError.message
            }, { status: 500 });
        }

        // Ahora obtener los productos
        const productsResult = await executeQuery(
            `SELECT 
        PRODUCTO_ID,
        VARIANTE_ID,
        SKU,
        NOMBRE_MOSTRADO,
        PRECIO_EFECTIVO,
        URL_PORTADA,
        ID_CATEGORIA,
        ACTIVO
      FROM APP_OWNER.VW_CATALOGO_PRODUCTOS
      WHERE ACTIVO = 'S' AND ROWNUM <= 5
      ORDER BY NOMBRE_MOSTRADO ASC`
        );

        return NextResponse.json({
            success: true,
            message: 'Query de productos exitosa',
            rowCount: productsResult.rows?.length || 0,
            sampleData: productsResult.rows
        });

    } catch (error: any) {
        console.error('❌ Error en query de productos:', error);
        return NextResponse.json({
            success: false,
            message: 'Error en query de productos',
            error: error.message,
            code: error.code,
            stack: error.stack
        }, { status: 500 });
    }
}
