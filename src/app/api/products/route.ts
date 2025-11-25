import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';
import type { Product } from '@/types';

interface OracleProductRow {
    PRODUCTO_ID: number;
    VARIANTE_ID: number | null;
    SKU: string | null;
    NOMBRE_MOSTRADO: string;
    PRECIO_EFECTIVO: number;
    URL_PORTADA: string | null;
    ID_CATEGORIA: number;
    ACTIVO: string;
    STOCK: number;
}

interface OracleCategoryRow {
    ID: number;
    NOMBRE_ES: string;
}

export async function GET() {
    try {
        console.log('🔍 Consultando productos desde Oracle Cloud...');

        // Consultar productos desde la vista del catálogo con stock
        const productsResult = await executeQuery<OracleProductRow>(
            `SELECT 
                p.ID as PRODUCTO_ID,
                v.ID as VARIANTE_ID,
                v.SKU,
                TO_CHAR(p.NOMBRE_ES) || (CASE WHEN v.NOMBRE_ES IS NOT NULL THEN ' ' || TO_CHAR(v.NOMBRE_ES) ELSE '' END) as NOMBRE_MOSTRADO,
                NVL(v.PRECIO_SOBRESCRITO, p.PRECIO) as PRECIO_EFECTIVO,
                (SELECT ma.URL 
                 FROM APP_OWNER.MEDIO_PRODUCTO mp
                 JOIN APP_OWNER.MEDIO_ARCHIVO ma ON mp.MEDIO_ID = ma.ID
                 WHERE mp.PRODUCTO_ID = p.ID
                   AND (mp.VARIANTE_ID = v.ID OR mp.VARIANTE_ID IS NULL)
                   AND mp.ES_PORTADA = 'S'
                 ORDER BY mp.VARIANTE_ID DESC NULLS LAST
                 FETCH FIRST 1 ROWS ONLY) as URL_PORTADA,
                p.ID_CATEGORIA,
                COALESCE(v.ACTIVO, 'S') as ACTIVO,
                NVL(si.EXISTENCIA, 0) as STOCK
            FROM APP_OWNER.PRODUCTOS p
            LEFT JOIN APP_OWNER.VARIANTES_PRODUCTO v ON p.ID = v.PRODUCTO_ID
            LEFT JOIN APP_OWNER.SALDOS_INVENTARIO si ON v.ID = si.VARIANTE_PRODUCTO_ID
            WHERE (v.ACTIVO = 'S' OR v.ID IS NULL)
            ORDER BY NOMBRE_MOSTRADO ASC`
        );

        console.log('📊 Resultado de productos:', {
            hasRows: !!productsResult.rows,
            rowCount: productsResult.rows?.length || 0
        });

        if (!productsResult.rows || productsResult.rows.length === 0) {
            console.warn('⚠️ No se encontraron productos en Oracle');
            return NextResponse.json([]);
        }

        // Obtener categorías para mapear IDs a nombres
        const categoriesResult = await executeQuery<OracleCategoryRow>(
            `SELECT ID, NOMBRE_ES FROM APP_OWNER.CATEGORIAS`
        );

        console.log('📊 Resultado de categorías:', {
            hasRows: !!categoriesResult.rows,
            rowCount: categoriesResult.rows?.length || 0
        });

        const categoryMap = new Map<number, string>();
        if (categoriesResult.rows) {
            categoriesResult.rows.forEach((cat: OracleCategoryRow) => {
                categoryMap.set(cat.ID, cat.NOMBRE_ES);
            });
        }

        // Transformar los resultados de Oracle al formato Product
        const products: Product[] = productsResult.rows.map((row: OracleProductRow) => {
            // Limpiar URL de imagen (eliminar dobles slashes excepto en protocolo)
            const rawImageUrl = row.URL_PORTADA || 'https://placehold.co/600x400.png';
            const imageUrl = rawImageUrl.replace(/([^:]\/)\/+/g, "$1");

            return {
                id: row.VARIANTE_ID ? `v_${row.VARIANTE_ID}` : `p_${row.PRODUCTO_ID}`,
                name: row.NOMBRE_MOSTRADO || 'Producto sin nombre',
                description: '', // La vista no incluye descripción
                price: row.PRECIO_EFECTIVO || 0,
                imageUrl: imageUrl,
                category: categoryMap.get(row.ID_CATEGORIA) || 'Sin categoría',
                stock: row.STOCK || 0,
            };
        });

        console.log(`✅ ${products.length} productos obtenidos de Oracle Cloud`);

        return NextResponse.json(products);

    } catch (error: any) {
        console.error('❌ Error al obtener productos de Oracle:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        console.error('Error stack:', error.stack);

        return NextResponse.json({
            error: 'No se pudieron cargar los productos desde Oracle Cloud',
            message: error.message,
            code: error.code
        }, { status: 500 });
    }
}
