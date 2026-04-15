export type ProductCategory =
  | 'Electronics'
  | 'Office Supplies'
  | 'Furniture'
  | 'Software'
  | 'Hardware';

export interface Product {
  readonly id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  reorderLevel: number;       // Triggers low-stock badge when stock <= reorderLevel
  imageUrl?: string;
  readonly createdAt: string;
}

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

/** Pure function: derive stock status from model data. No side effects. */
export function getStockStatus(product: Product): StockStatus {
  if (product.stock === 0) return 'out-of-stock';
  if (product.stock <= product.reorderLevel) return 'low-stock';
  return 'in-stock';
}

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Electronics', 'Office Supplies', 'Furniture', 'Software', 'Hardware'
];