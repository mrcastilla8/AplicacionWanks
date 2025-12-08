import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';
import type { ProductWithVariants } from '@/types';

interface OracleProductRow {
    PRODUCTO_ID: number;
    PRODUCTO_NOMBRE: string;
    PRODUCTO_DESC: string | null;
    URL_PORTADA: string | null;
    CATEGORIA_NOMBRE: string;
    VARIANTE_ID: number;
    VARIANTE_NOMBRE: string;
    VARIANTE_PRECIO: number;
    VARIANTE_STOCK: number;
}

export async function GET() {
    try {
        console.log('Consultando productos agrupados con variantes desde Oracle Cloud...');

        const result = await executeQuery<OracleProductRow>(
            `SELECT 
                p.ID as PRODUCTO_ID,
                TO_CHAR(p.NOMBRE_ES) as PRODUCTO_NOMBRE,
                TO_CHAR(p.DESCRIPCION_ES) as PRODUCTO_DESC,
                (SELECT ma.URL 
                 FROM APP_OWNER.MEDIO_PRODUCTO mp
                 JOIN APP_OWNER.MEDIO_ARCHIVO ma ON mp.MEDIO_ID = ma.ID
                 WHERE mp.PRODUCTO_ID = p.ID
                   AND mp.VARIANTE_ID IS NULL
                   AND mp.ES_PORTADA = 'S'
                 FETCH FIRST 1 ROWS ONLY) as URL_PORTADA,
                TO_CHAR(c.NOMBRE_ES) as CATEGORIA_NOMBRE,
                v.ID as VARIANTE_ID,
                NVL(TO_CHAR(v.NOMBRE_ES), 'Unidad') as VARIANTE_NOMBRE,
                NVL(v.PRECIO_SOBRESCRITO, p.PRECIO) as VARIANTE_PRECIO,
                NVL(si.EXISTENCIA, 0) - NVL(si.RESERVADO, 0) as VARIANTE_STOCK
            FROM APP_OWNER.PRODUCTOS p
            JOIN APP_OWNER.VARIANTES_PRODUCTO v ON p.ID = v.PRODUCTO_ID
            LEFT JOIN APP_OWNER.CATEGORIAS c ON p.ID_CATEGORIA = c.ID
            LEFT JOIN APP_OWNER.SALDOS_INVENTARIO si ON v.ID = si.VARIANTE_PRODUCTO_ID
            WHERE v.ACTIVO = 'S'
            ORDER BY p.NOMBRE_ES, v.ID`
        );

        console.log('Resultado de productos:', {
            hasRows: !!result.rows,
            rowCount: result.rows?.length || 0
        });

        if (!result.rows || result.rows.length === 0) {
            console.warn('No se encontraron productos en Oracle');
            return NextResponse.json([]);
        }

        const productsMap = new Map<number, ProductWithVariants>();

        for (const row of result.rows) {
            const productId = row.PRODUCTO_ID;

            if (!productsMap.has(productId)) {
                const imageUrl = row.URL_PORTADA || 'https://placehold.co/600x400.png';

                const productName = row.PRODUCTO_NOMBRE ? String(row.PRODUCTO_NOMBRE) : 'Producto sin nombre';
                const productDesc = row.PRODUCTO_DESC ? String(row.PRODUCTO_DESC) : '';
                const categoryName = row.CATEGORIA_NOMBRE ? String(row.CATEGORIA_NOMBRE) : 'Sin categoría';

                productsMap.set(productId, {
                    id: String(productId),
                    name: productName,
                    description: productDesc,
                    imageUrl: imageUrl,
                    category: categoryName,
                    variants: []
                });
            }

            const product = productsMap.get(productId)!;
            const variantName = row.VARIANTE_NOMBRE ? String(row.VARIANTE_NOMBRE) : 'Unidad';
            product.variants.push({
                id: String(row.VARIANTE_ID),
                name: variantName,
                price: row.VARIANTE_PRECIO || 0,
                stock: Math.max(0, row.VARIANTE_STOCK || 0)
            });
        }

        const products = Array.from(productsMap.values());

        console.log(`${products.length} productos agrupados con variantes obtenidos de Oracle Cloud`);

        return NextResponse.json(products);

    } catch (error: any) {
        console.error('Error al obtener productos de Oracle:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);

        return NextResponse.json({
            error: 'No se pudieron cargar los productos desde Oracle Cloud',
            message: error.message,
            code: error.code
        }, { status: 500 });
    }
}
