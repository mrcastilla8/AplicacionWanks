import type { Product } from '@/types';
import { products as localProducts } from '@/data/products';

export async function getProducts(): Promise<Product[]> {
  try {
    console.log('📦 Obteniendo productos desde Oracle Cloud (API)...');

    // Build the full URL for client-side fetching
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store', // Siempre obtener datos frescos
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const productsFromOracle = await response.json();

    if (Array.isArray(productsFromOracle) && productsFromOracle.length > 0) {
      console.log(`✅ ${productsFromOracle.length} productos cargados desde Oracle`);
      return productsFromOracle;
    }

    console.warn('⚠️ No se obtuvieron productos de Oracle, usando datos locales.');
    return localProducts;

  } catch (error) {
    console.error('❌ Error al obtener productos de Oracle:', error);
    console.warn('⚠️ Recurriendo a datos locales debido a error de Oracle.');
    return localProducts;
  }
}
