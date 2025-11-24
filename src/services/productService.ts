import type { Product } from '@/types';
import { products as localProducts } from '@/data/products';
import { getProductsFromOracle } from '@/actions/productActions';

export async function getProducts(): Promise<Product[]> {
  await new Promise(resolve => setTimeout(resolve, 500));

  try {
    console.log('📦 Obteniendo productos desde Oracle Cloud...');
    const productsFromOracle = await getProductsFromOracle();

    if (productsFromOracle && productsFromOracle.length > 0) {
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

