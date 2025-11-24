# A Tener en Cuenta para Configurar y Ejecutar el Proyecto

Este documento proporciona una guía sobre los requisitos y pasos para configurar y ejecutar este proyecto Next.js con Supabase y Genkit.

## 1. Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

*   **Node.js**: Se recomienda la versión LTS (Long Term Support) o superior. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
*   **npm** (Node Package Manager): Generalmente se instala junto con Node.js.
    *   Opcionalmente, puedes usar **yarn** como gestor de paquetes.

## 2. Configuración del Proyecto

1.  **Clonar el Repositorio**:
    Si estás trabajando con un repositorio Git, clónalo a tu máquina local:
    ```bash
    git clone <url-del-repositorio>
    cd <nombre-del-directorio-del-proyecto>
    ```

2.  **Instalar Dependencias**:
    Este proyecto utiliza `package.json` para gestionar sus dependencias. Para instalarlas, ejecuta el siguiente comando en la raíz del proyecto:
    ```bash
    npm install
    ```
    o si usas yarn:
    ```bash
    yarn install
    ```
    Esto creará una carpeta `node_modules` con todas las dependencias necesarias.

## 3. Variables de Entorno

El proyecto requiere ciertas variables de entorno para funcionar correctamente, especialmente para la conexión con Supabase y Google AI (Genkit).

1.  Crea un archivo llamado `.env` en la raíz de tu proyecto (este archivo está en `.gitignore` y no debe ser subido al control de versiones).
2.  Añade las siguientes variables a tu archivo `.env` y reemplaza los valores (Se dara las Keys para que la web pueda funcionar, solo crear el archivo .env y pegar las keys), el archivo .env ya estara en el zip, siga estos pasos solo si es que no tiene el .env:

    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=https://rujqfdpeyoekhzesiorf.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1anFmZHBleW9la2h6ZXNpb3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NDQ0MDEsImV4cCI6MjA2NTUyMDQwMX0.vDVNSDvcWjibdYbK6FE-w2zaVnW95VIaGOGh3l2Eh9s

    # Google AI (para Genkit)
    GOOGLE_API_KEY=AIzaSyBuJL_NVWGUP3Hfp7NMQvsPu2jEbxrUJx4
    

## 4. Ejecutar la Aplicación

El proyecto tiene dos componentes principales que necesitan ser ejecutados para el desarrollo:

1.  **Servidor de Desarrollo de Next.js**:
    Inicia la aplicación Next.js (frontend):
    ```bash
    npm run dev
    ```
    Esto usualmente levantará la aplicación en `http://localhost:9002` (o el puerto configurado en `package.json`).

2.  **Servidor de Desarrollo de Genkit**:
    En una terminal separada, inicia el servidor de desarrollo de Genkit para las funciones de IA:
    ```bash
    npm run genkit:dev
    ```
    o para que se reinicie automáticamente con los cambios:
    ```bash
    npm run genkit:watch
    ```
    Genkit usualmente corre en `http://localhost:3400` y la UI de inspección en `http://localhost:4000`.