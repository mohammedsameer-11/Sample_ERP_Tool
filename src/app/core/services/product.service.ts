import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Product, ProductCategory, getStockStatus } from '../models/product.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';
import { MOCK_PRODUCTS } from './mock-data/products.mock';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly store = signal<Product[]>([...MOCK_PRODUCTS]);

  // Computed derived state — used by DashboardService
  readonly totalProducts = computed(() => this.store().length);
  readonly lowStockCount = computed(() =>
    this.store().filter(p => getStockStatus(p) !== 'in-stock').length
  );

  getAll(category?: ProductCategory | ''): Observable<PaginatedResponse<Product>> {
    return of(this.store()).pipe(
      delay(350),
      map(products => {
        const data = category
          ? products.filter(p => p.category === category)
          : products;
        return {
          data,
          totalCount: data.length,
          totalPages: 1,
          page: 1,
          pageSize: data.length,
        };
      })
    );
  }

  /** Simulates PATCH /api/products/:id/stock — partial update */
  addStock(id: string, quantity: number): Observable<ApiResponse<Product>> {
    let updated!: Product;
    this.store.update(list =>
      list.map(p => {
        if (p.id === id) {
          updated = { ...p, stock: p.stock + quantity };
          return updated;
        }
        return p;
      })
    );
    return of({ data: updated, totalCount: 1, page: 1, pageSize: 1, success: true })
      .pipe(delay(250));
  }
}