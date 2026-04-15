import {
  Component, OnInit, inject, signal, computed, DestroyRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProductService } from '../../../core/services/product.service';
import { Product, ProductCategory, PRODUCT_CATEGORIES } from '../../../core/models/product.model';
import { ProductCardComponent } from '../product-card/product-card.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ProductCardComponent],
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal(true);
  readonly selectedCategory = signal<ProductCategory | ''>('');
  readonly addingProductId = signal<string | null>(null);

  readonly lowStockCount = computed(() => this.productService.lowStockCount());

  readonly categories = PRODUCT_CATEGORIES;

  ngOnInit(): void {
    this.loadProducts();
  }

  setCategory(cat: ProductCategory | ''): void {
    this.selectedCategory.set(cat);
    this.loadProducts();
  }

  onAddStock(productId: string, quantity: number): void {
    this.addingProductId.set(productId);
    this.productService.addStock(productId, quantity)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          // Update just the one product in the signal — surgical update
          this.products.update(list =>
            list.map(p => p.id === productId ? response.data : p)
          );
          this.addingProductId.set(null);
        },
        error: () => this.addingProductId.set(null),
      });
  }

  private loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getAll(this.selectedCategory())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: response => {
          this.products.set(response.data);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false),
      });
  }
}