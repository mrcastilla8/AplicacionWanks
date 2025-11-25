import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/oracle';

interface OracleLocationRow {
    ID: number;
    NOMBRE_ES: string;
    DIRECCION: string;
    HORARIO_ES: string;
    LATITUD: number;
    LONGITUD: number;
}

export async function GET() {
    try {
        // Use TO_CHAR to convert CLOB fields to VARCHAR2 in the query
        const result = await executeQuery<OracleLocationRow>(
            `SELECT 
                ID, 
                TO_CHAR(NOMBRE_ES) as NOMBRE_ES, 
                TO_CHAR(DIRECCION) as DIRECCION, 
                TO_CHAR(HORARIO_ES) as HORARIO_ES, 
                LATITUD, 
                LONGITUD 
             FROM APP_OWNER.LOCALES`
        );

        if (!result.rows) {
            return NextResponse.json([]);
        }

        const locations = result.rows.map(row => ({
            id: row.ID.toString(),
            name: row.NOMBRE_ES || '',
            address: row.DIRECCION || '',
            operatingHours: row.HORARIO_ES || '',
            latitude: row.LATITUD,
            longitude: row.LONGITUD
        }));

        return NextResponse.json(locations);
    } catch (error: any) {
        console.error('Error fetching locations:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
