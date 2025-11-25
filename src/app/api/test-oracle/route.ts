import { NextResponse } from 'next/server';
import { getOracleConnection } from '@/lib/oracle';

export async function GET() {
    try {
        console.log('🧪 Probando conexión a Oracle...');
        const connection = await getOracleConnection();

        // Test simple query
        const result = await connection.execute('SELECT 1 as TEST FROM DUAL');

        await connection.close();

        return NextResponse.json({
            success: true,
            message: 'Conexión a Oracle exitosa',
            testResult: result.rows
        });

    } catch (error: any) {
        console.error('❌ Error de conexión a Oracle:', error);
        return NextResponse.json({
            success: false,
            message: 'Error conectando a Oracle',
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
