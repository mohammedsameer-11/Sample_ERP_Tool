import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Product, getStockStatus, StockStatus } from '../../../core/models/product.model';

/**
 * Dumb component: receives a product, emits addStock event with quantity.
 * Parent owns the service call — this component just renders.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, FormsModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  readonly product = input.required<Product>();
  readonly isAdding = input<boolean>(false);
  readonly addStock = output<number>();  // emits quantity

  addQty: number = 1;

  handleAddStock(): void {
    if (this.addQty >= 1) {
      this.addStock.emit(this.addQty);
      this.addQty = 1;
    }
  }

  private get status(): StockStatus {
    return getStockStatus(this.product());
  }

  getStockBadgeClass(): string {
    const map: Record<StockStatus, string> = {
      'in-stock':    'bg-green-50 text-green-700',
      'low-stock':   'bg-amber-50 text-amber-700',
      'out-of-stock': 'bg-red-50 text-red-700',
    };
    return map[this.status];
  }

  getStockBarClass(): string {
    const map: Record<StockStatus, string> = {
      'in-stock':    'bg-green-500',
      'low-stock':   'bg-amber-400',
      'out-of-stock': 'bg-red-400',
    };
    return map[this.status];
  }

  getStockLabel(): string {
    const map: Record<StockStatus, string> = {
      'in-stock':    'In Stock',
      'low-stock':   'Low Stock',
      'out-of-stock': 'Out of Stock',
    };
    return map[this.status];
  }

  getStockPercent(): number {
    const maxStock = this.product().reorderLevel * 4;
    return Math.min(100, (this.product().stock / maxStock) * 100);
  }
}