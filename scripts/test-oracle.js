const oracledb = require('oracledb');
const fs = require('fs');
const path = require('path');

// Leer archivo .env manualmente
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '..', '.env');
    const envFile = fs.readFileSync(envPath, 'utf8');
    const envVars = {};
    envFile.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        if (key && !key.startsWith('#')) {
          envVars[key] = value;
        }
      }
    });
    return envVars;
  } catch (e) {
    console.error('Error leyendo .env:', e.message);
    return {};
  }
}

const env = loadEnv();

// Inicializar Oracle Client en modo Thick si ORACLE_LIB_DIR está definido
const libDir = env.ORACLE_LIB_DIR;
if (libDir) {
  try {
    oracledb.initOracleClient({ libDir });
    console.log(`✅ Oracle Client inicializado en modo Thick desde: ${libDir}`);
  } catch (err) {
    if (err.message && err.message.includes('DPI-1047')) {
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
function getConnectionString(alias, walletPath) {
  if (!alias || !walletPath) return alias;
  if (alias.trim().toLowerCase().startsWith('(description')) return alias;

  try {
    const tnsPath = path.join(walletPath, 'tnsnames.ora');
    if (!fs.existsSync(tnsPath)) {
      console.warn(`⚠️ No se encontró tnsnames.ora en ${walletPath}`);
      return alias;
    }

    const tnsContent = fs.readFileSync(tnsPath, 'utf-8');
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

async function testConnection() {
  console.log('--- Iniciando Prueba de Conexión a Oracle ---');

  const user = env.ORACLE_USER || 'ADMIN';
  const password = env.ORACLE_PASSWORD;
  const alias = env.ORACLE_CONN_STRING;
  const walletDir = env.ORACLE_WALLET_DIR || './oracle_wallet';
  const absWalletDir = path.resolve(__dirname, '..', walletDir);

  console.log(`Usuario: ${user}`);
  console.log(`Wallet Dir: ${absWalletDir}`);
  console.log(`Modo: ${libDir ? 'Thick' : 'Thin'}`);

  if (!password) {
    console.error('❌ ERROR: No se encontró ORACLE_PASSWORD en el archivo .env');
    return;
  }

  // Resolver string de conexión manualmente
  const connectString = getConnectionString(alias, absWalletDir);
  console.log(`Connect String (primeros 50 chars): ${connectString.substring(0, 50)}...`);

  try {
    console.log('Intentando conectar...');

    const connection = await oracledb.getConnection({
      user: user,
      password: password,
      connectString: connectString,
      walletLocation: absWalletDir,
      walletPassword: password,
    });

    console.log('✅ ¡CONEXIÓN EXITOSA!');

    const result = await connection.execute(
      `SELECT 'Hola desde Oracle Cloud! Fecha: ' || TO_CHAR(SYSDATE, 'YYYY-MM-DD HH24:MI:SS') AS SALUDO FROM DUAL`
    );

    console.log('Resultado de prueba:', result.rows[0]);

    await connection.close();
    console.log('Conexión cerrada.');

  } catch (err) {
    console.error('❌ ERROR DE CONEXIÓN:');
    console.error(err);
    console.error('Código de error:', err.code);
    console.error('Mensaje:', err.message);
  }
}

testConnection();
