import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';
import oracledb from 'oracledb';

interface OracleWishlistRow {
    WISHLIST_ITEM_ID: number;
    PRODUCTO_ID: number;
    VARIANTE_ID: number | null;
    SKU: string | null;
    NOMBRE_MOSTRADO: string;
    PRECIO_EFECTIVO: number;
    URL_PORTADA: string | null;
    FECHA_AGREGADO: Date;
}


export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Falta el userId' }, { status: 400 });
        }

        console.log(`🔍 Consultando Wishlist para usuario ${userId}...`);

        const query = `
            SELECT 
                wi.ID as WISHLIST_ITEM_ID,
                p.ID as PRODUCTO_ID,
                v.ID as VARIANTE_ID,
                v.SKU,
                TO_CHAR(p.NOMBRE_ES) || (CASE WHEN v.NOMBRE_ES IS NOT NULL THEN ' ' || TO_CHAR(v.NOMBRE_ES) ELSE '' END) as NOMBRE_MOSTRADO,
                NVL(v.PRECIO_SOBRESCRITO, p.PRECIO) as PRECIO_EFECTIVO,
                wi.CREADO_EN as FECHA_AGREGADO,
                (SELECT ma.URL 
                 FROM APP_OWNER.MEDIO_PRODUCTO mp
                 JOIN APP_OWNER.MEDIO_ARCHIVO ma ON mp.MEDIO_ID = ma.ID
                 WHERE mp.PRODUCTO_ID = p.ID
                   AND (mp.VARIANTE_ID = v.ID OR mp.VARIANTE_ID IS NULL)
                   AND mp.ES_PORTADA = 'S'
                 ORDER BY mp.VARIANTE_ID DESC NULLS LAST
                 FETCH FIRST 1 ROWS ONLY) as URL_PORTADA
            FROM APP_OWNER.WISHLISTS w
            JOIN APP_OWNER.WISHLIST_ITEMS wi ON w.ID = wi.WISHLIST_ID
            JOIN APP_OWNER.PRODUCTOS p ON wi.PRODUCTO_ID = p.ID
            LEFT JOIN APP_OWNER.VARIANTES_PRODUCTO v ON wi.VARIANTE_ID = v.ID
            WHERE w.PERFIL_ID = :idUsuario
            ORDER BY wi.CREADO_EN DESC
        `;

        const result = await executeQuery<OracleWishlistRow>(query, [userId]);

        const items = (result.rows || []).map((row) => {
            const rawImageUrl = row.URL_PORTADA || 'https://placehold.co/600x400.png';
            const imageUrl = rawImageUrl.replace(/([^:]\/)\/+/g, "$1");

            return {
                id: row.WISHLIST_ITEM_ID,
                productId: row.PRODUCTO_ID,
                variantId: row.VARIANTE_ID,
                name: row.NOMBRE_MOSTRADO,
                price: row.PRECIO_EFECTIVO,
                image: imageUrl,
                addedAt: row.FECHA_AGREGADO
            };
        });

        return NextResponse.json(items);

    } catch (error: any) {
        console.error('❌ Error GET Wishlist:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper to parse IDs
async function parseIds(productIdStr: string, variantIdStr: string | null | undefined) {
    let p_id: number | null = null;
    let v_id: number | null = null;

    // Handle productId from frontend (e.g. "p_123" or "v_456")
    if (productIdStr.startsWith('p_')) {
        p_id = parseInt(productIdStr.substring(2));
    } else if (productIdStr.startsWith('v_')) {
        v_id = parseInt(productIdStr.substring(2));
        // We need to find the parent PRODUCTO_ID for this variant
        const query = `SELECT PRODUCTO_ID FROM APP_OWNER.VARIANTES_PRODUCTO WHERE ID = :id`;
        const result = await executeQuery<{ PRODUCTO_ID: number }>(query, [v_id]);
        if (result.rows && result.rows.length > 0) {
            p_id = result.rows[0].PRODUCTO_ID;
        } else {
            throw new Error(`Variante no encontrada: ${v_id}`);
        }
    } else {
        // Fallback: try parsing directly
        p_id = parseInt(productIdStr);
    }

    // If explicit variantId was passed (though context currently passes null)
    if (variantIdStr) {
        v_id = parseInt(variantIdStr);
    }

    return { p_id, v_id };
}

// 3. Método POST: Agregar item (Usando el Package)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, productId, variantId } = body;

        console.log('📝 POST Wishlist Body:', { userId, productId, variantId });

        const u_id = parseInt(String(userId));
        if (isNaN(u_id)) {
            return NextResponse.json({ error: 'User ID inválido' }, { status: 400 });
        }

        const { p_id, v_id } = await parseIds(String(productId), variantId ? String(variantId) : null);

        if (!p_id || isNaN(p_id)) {
            return NextResponse.json({ error: 'Product ID inválido' }, { status: 400 });
        }

        // Llamamos al Procedimiento Almacenado del Package
        const query = `
            BEGIN
                APP_OWNER.PKG_WISHLIST.SP_AGREGAR_ITEM(
                    p_perfil_id   => :u_id,
                    p_producto_id => :p_id,
                    p_variante_id => :v_id,
                    p_resultado   => :out_msg
                );
            END;
        `;

        const params = {
            u_id: u_id,
            p_id: p_id,
            v_id: v_id,
            out_msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        };

        // executeQuery generalmente devuelve el objeto result completo de oracle
        const result: any = await executeQuery(query, params);
        const mensaje = result.outBinds?.out_msg;

        if (mensaje === 'OK') {
            return NextResponse.json({ success: true, message: 'Producto guardado' });
        } else {
            return NextResponse.json({ success: false, message: mensaje }, { status: 400 });
        }

    } catch (error: any) {
        console.error('❌ Error POST Wishlist:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 4. Método DELETE: Eliminar item
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, productId, variantId } = body;

        console.log('🗑️ DELETE Wishlist Body:', { userId, productId, variantId });

        const u_id = parseInt(String(userId));

        // For DELETE, productId might be the numeric ID if coming from Wishlist Page (where we have clean IDs)
        // OR it might be the string ID if coming from Product Card toggle.
        // Let's handle both.

        let p_id: number;
        let v_id: number | null = null;

        if (typeof productId === 'number') {
            p_id = productId;
            v_id = variantId ? parseInt(String(variantId)) : null;
        } else {
            const parsed = await parseIds(String(productId), variantId ? String(variantId) : null);
            p_id = parsed.p_id!;
            v_id = parsed.v_id;
        }

        const query = `
            BEGIN
                APP_OWNER.PKG_WISHLIST.SP_ELIMINAR_ITEM(
                    p_perfil_id   => :u_id,
                    p_producto_id => :p_id,
                    p_variante_id => :v_id,
                    p_resultado   => :out_msg
                );
            END;
        `;

        const params = {
            u_id: u_id,
            p_id: p_id,
            v_id: v_id,
            out_msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING }
        };

        await executeQuery(query, params);

        return NextResponse.json({ success: true, message: 'Eliminado' });

    } catch (error: any) {
        console.error('❌ Error DELETE Wishlist:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
