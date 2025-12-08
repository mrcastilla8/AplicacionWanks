'use server';

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
}

interface OracleCategoryRow {
    ID: number;
    ID_NUM: number;
    NOMBRE_ES: string;
}

export async function getProductsFromOracle(): Promise<Product[]> {
    try {
        console.log('Consultando productos desde Oracle Cloud...');

        const productsResult = await executeQuery<OracleProductRow>(
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
      WHERE ACTIVO = 'S'
      ORDER BY NOMBRE_MOSTRADO ASC`
        );

        console.log('Resultado de productos:', {
            hasRows: !!productsResult.rows,
            rowCount: productsResult.rows?.length || 0
        });

        if (!productsResult.rows || productsResult.rows.length === 0) {
            console.warn('No se encontraron productos en Oracle');
            return [];
        }

        const categoriesResult = await executeQuery<OracleCategoryRow>(
            `SELECT ID, ID_NUM, NOMBRE_ES FROM APP_OWNER.CATEGORIAS`
        );

        console.log('Resultado de categorías:', {
            hasRows: !!categoriesResult.rows,
            rowCount: categoriesResult.rows?.length || 0
        });

        const categoryMap = new Map<number, string>();
        if (categoriesResult.rows) {
            categoriesResult.rows.forEach((cat: OracleCategoryRow) => {
                const catId = cat.ID_NUM || cat.ID;
                categoryMap.set(catId, cat.NOMBRE_ES);
            });
        }

        const products: Product[] = productsResult.rows.map((row: OracleProductRow) => ({
            id: row.PRODUCTO_ID.toString(),
            name: row.NOMBRE_MOSTRADO || 'Producto sin nombre',
            description: '',
            price: row.PRECIO_EFECTIVO || 0,
            imageUrl: row.URL_PORTADA || 'https://placehold.co/600x400.png',
            category: categoryMap.get(row.ID_CATEGORIA) || 'Sin categoría',
            stock: 0,
        }));

        console.log(`${products.length} productos obtenidos de Oracle Cloud`);
        return products;

    } catch (error) {
        console.error('Error al obtener productos de Oracle:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
        }
        throw new Error('No se pudieron cargar los productos desde Oracle Cloud');
    }
}
