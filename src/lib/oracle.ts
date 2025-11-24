import oracledb from 'oracledb';
import path from 'path';
import fs from 'fs';

// Configuración de la conexión para Oracle Cloud Autonomous Database
const walletDir = process.env.ORACLE_WALLET_DIR
    ? path.resolve(process.cwd(), process.env.ORACLE_WALLET_DIR)
    : undefined;

// Inicializar Oracle Client en modo Thick si ORACLE_LIB_DIR está definido
const libDir = process.env.ORACLE_LIB_DIR;
if (libDir) {
    try {
        oracledb.initOracleClient({ libDir });
        console.log(`✅ Oracle Client inicializado en modo Thick desde: ${libDir}`);
    } catch (err: any) {
        if (err.message.includes('DPI-1047')) {
            console.warn('⚠️ Oracle Client ya fue inicializado. Continuando...');
        } else {
            console.error('❌ Error al inicializar Oracle Client en modo Thick:', err);
            throw err;
        }
    }
} else {
    console.log('ℹ️ Usando modo Thin (sin Oracle Instant Client)');
}

// Función para obtener el string de conexión completo desde tnsnames.ora
function getConnectionString(alias: string | undefined, walletPath: string | undefined): string | undefined {
    if (!alias || !walletPath) return alias;

    // Si ya parece un descriptor completo (empieza con (description=...), devolverlo tal cual
    if (alias.trim().toLowerCase().startsWith('(description')) {
        return alias;
    }

    try {
        const tnsPath = path.join(walletPath, 'tnsnames.ora');
        if (!fs.existsSync(tnsPath)) {
            console.warn(`⚠️ No se encontró tnsnames.ora en ${walletPath}`);
            return alias;
        }

        const tnsContent = fs.readFileSync(tnsPath, 'utf-8');
        // Buscar el alias. Formato: ALIAS = (DESCRIPTION...)
        const regex = new RegExp(`^\\s*${alias}\\s*=\\s*(.*)`, 'mi');
        const match = tnsContent.match(regex);

        if (match && match[1]) {
            console.log(`✅ TNS Alias '${alias}' resuelto exitosamente desde tnsnames.ora`);
            return match[1].trim();
        }
    } catch (err) {
        console.error('Error leyendo tnsnames.ora:', err);
    }

    return alias;
}

const connectionString = getConnectionString(process.env.ORACLE_CONN_STRING, walletDir);

const dbConfig: oracledb.PoolAttributes = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: connectionString,
    // Para Oracle Cloud Autonomous Database con wallet
    ...(walletDir && {
        walletLocation: walletDir,
        walletPassword: '', // Auto-login wallet
    }),
};

let pool: oracledb.Pool | null = null;

export async function getOracleConnection() {
    if (!pool) {
        try {
            console.log('🔧 Configuración de Oracle:', {
                user: dbConfig.user,
                connectString: dbConfig.connectString?.substring(0, 50) + '...', // Log parcial por seguridad
                walletLocation: walletDir,
                mode: libDir ? 'Thick' : 'Thin',
            });

            pool = await oracledb.createPool({
                ...dbConfig,
                poolMin: 1,
                poolMax: 4,
                poolIncrement: 1,
            });
            console.log('✅ Pool de conexiones a Oracle creado exitosamente.');
        } catch (err) {
            console.error('❌ Error al crear el pool de conexiones a Oracle:', err);
            throw err;
        }
    }

    try {
        const connection = await pool.getConnection();
        return connection;
    } catch (err) {
        console.error('❌ Error al obtener una conexión del pool:', err);
        throw err;
    }
}

export async function closeOraclePool() {
    if (pool) {
        try {
            await pool.close(0);
            console.log('Pool de conexiones a Oracle cerrado.');
            pool = null;
        } catch (err) {
            console.error('Error al cerrar el pool de conexiones:', err);
        }
    }
}

// Helper para ejecutar consultas simples
export async function executeQuery<T = any>(
    sql: string,
    binds: oracledb.BindParameters = [],
    options: oracledb.ExecuteOptions = {}
) {
    let connection;
    try {
        connection = await getOracleConnection();
        // Por defecto, devolver resultados como objetos (clave-valor) en lugar de arrays
        const opts: oracledb.ExecuteOptions = {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true,
            ...options
        };
        const result = await connection.execute<T>(sql, binds, opts);
        return result;
    } catch (err) {
        console.error('❌ Error ejecutando query:', sql, err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error cerrando la conexión:', err);
            }
        }
    }
}
