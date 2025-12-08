# Wankas - Plataforma de Comercio Electrónico Inteligente para Productos Comestibles

Wankas es una plataforma de comercio electrónico de vanguardia diseñada específicamente para la venta y gestión de productos comestibles. El proyecto se distingue por su enfoque en la eficiencia operativa a través de un modelo de "recojo en tienda y pago al momento", y su integración estratégica de capacidades de Inteligencia Artificial para enriquecer la experiencia del usuario y optimizar la gestión culinaria personal.

## Descripción General del Proyecto

El objetivo principal de Wankas es ofrecer una solución integral para la compra de alimentos, permitiendo a los usuarios explorar un catálogo diverso, gestionar sus selecciones en un carrito de compras digital y formalizar pedidos que serán recogidos en una de las sedes físicas designadas.

Una característica central e innovadora de Wankas es su módulo de inteligencia artificial. Este módulo permite a los usuarios interactuar con la plataforma de una manera completamente nueva: subiendo imágenes de alimentos, el sistema es capaz de reconocer dichos productos y, a partir de ellos, generar sugerencias de recetas. Además, la plataforma identifica los ingredientes que puedan faltar para la preparación de una receta seleccionada y ofrece la opción de añadirlos directamente al carrito de compras.

## Capacidades Clave del Sistema

* **Gestión de Catálogo de Productos:** Visualización clara y organizada de productos con funcionalidades de búsqueda avanzada, filtrado y ordenamiento.
* **Módulo de Carrito de Compras:** Gestión completa del carrito con resumen en tiempo real.
* **Sistema de Autenticación y Perfil de Usuario:** Gestión segura de usuarios (registro, login, perfiles) y seguridad optimizada.
* **Proceso de Checkout:** Optimizado para el modelo "recojo en tienda y pago al momento".
* **Funcionalidad Inteligente de Alimentos y Recetas:**
    * **Identificación Visual:** Reconocimiento de ingredientes mediante IA.
    * **Generación de Recetas:** Sugerencias contextuales basadas en ingredientes.
    * **Asistencia de Compra:** Integración inteligente entre recetas y carrito de compras.

## Arquitectura Tecnológica

Wankas utiliza un stack moderno basado en React y Next.js:

* **Framework Full Stack:** **Next.js** (App Router) para frontend y backend.
* **Lenguaje:** **TypeScript** para un desarrollo robusto y tipado.
* **Estilos:** **Tailwind CSS** junto con **Radix UI** y **Lucide React** para una interfaz moderna y responsiva.
* **Base de Datos:** **Oracle Database** para la persistencia de datos (productos, usuarios, pedidos), integrada mediante `oracledb`.
* **Inteligencia Artificial:** **Google Genkit** para la integración de servicios de IA generativa y visión.

## Despliegue local

Para ejecutar el proyecto localmente:

1.  Instalar las dependencias:
    ```bash
    npm install
    ```
2.  Iniciar el servidor de desarrollo:
    ```bash
    npm run dev
    ```
3.  La aplicación estará disponible generalmente en `http://localhost:3000`.

**Nota:** Es posible que necesite configurar variables de entorno para la conexión a la base de datos y servicios de IA. También se recomienda ejecutar Genkit si se va a trabajar con las funcionalidades de IA (`npx genkit start` o el script correspondiente).

## Documentación y Entregables

**Todos los entregables del proyecto y documentación detallada se encuentran ubicados en la carpeta `Documentos`.**

## Integrantes

* Axel Andree Cueva Alcala
* Castilla Huanca Marco Renato
* Basualdo Ale Marcos Luis
* Poma Gutierrez Gabriel Antonio
* De la Cruz Meza Angel Luis Kallpa
* Huanca Tapia Lita Nikole
