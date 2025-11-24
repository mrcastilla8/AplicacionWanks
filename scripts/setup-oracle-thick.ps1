# Script para configurar Oracle Instant Client en modo Thick
# Este script asume que ya descargaste instantclient-basic-windows.x64-XX.X.X.XX.XX.zip

Write-Host "=== Configuración de Oracle Instant Client ===" -ForegroundColor Cyan

# Paso 1: Verificar si ya existe
$instantClientDir = "C:\oracle\instantclient_23_6"
if (Test-Path $instantClientDir) {
    Write-Host "✓ Oracle Instant Client ya existe en $instantClientDir" -ForegroundColor Green
} else {
    Write-Host "⚠ Oracle Instant Client NO encontrado en $instantClientDir" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Descarga 'Basic Package (ZIP)' desde:" -ForegroundColor White
    Write-Host "   https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html"
    Write-Host "2. Extrae el ZIP a C:\oracle\" -ForegroundColor White
    Write-Host "3. Renombra la carpeta a 'instantclient_23_6' (o ajusta la ruta en este script)" -ForegroundColor White
    Write-Host ""
    Read-Host "Presiona Enter cuando hayas completado estos pasos"
}

# Paso 2: Verificar archivos necesarios
$requiredFiles = @("oci.dll", "oraociei23.dll")
$allFilesExist = $true

foreach ($file in $requiredFiles) {
    $filePath = Join-Path $instantClientDir $file
    if (Test-Path $filePath) {
        Write-Host "✓ Encontrado: $file" -ForegroundColor Green
    } else {
        Write-Host "✗ Falta: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ Faltan archivos necesarios. Verifica la instalación." -ForegroundColor Red
    exit 1
}

# Paso 3: Actualizar .env
Write-Host ""
Write-Host "Actualizando archivo .env..." -ForegroundColor Cyan

$envPath = ".env"
$envContent = Get-Content $envPath -Raw

# Agregar o actualizar ORACLE_LIB_DIR
if ($envContent -match "ORACLE_LIB_DIR=") {
    $envContent = $envContent -replace "ORACLE_LIB_DIR=.*", "ORACLE_LIB_DIR=$instantClientDir"
    Write-Host "✓ ORACLE_LIB_DIR actualizado" -ForegroundColor Green
} else {
    $envContent += "`nORACLE_LIB_DIR=$instantClientDir"
    Write-Host "✓ ORACLE_LIB_DIR agregado" -ForegroundColor Green
}

Set-Content -Path $envPath -Value $envContent

Write-Host ""
Write-Host "=== Configuración Completa ===" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora ejecuta:" -ForegroundColor Yellow
Write-Host "  node scripts/test-oracle.js" -ForegroundColor White
Write-Host ""
Write-Host "Si funciona, reinicia el servidor con:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor White
