import {
  Component, OnInit, inject, signal, computed, ChangeDetectionStrategy,
  DestroyRef
} from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe, DatePipe, NgClass, PercentPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardData, KpiMetric, MonthlySales } from '../../core/models/dashboard.model';

/**
 * ARCHITECTURAL DECISION: ChangeDetectionStrategy.OnPush
 *
 * OnPush tells Angular: "Only re-render this component when:
 * 1. An @Input() reference changes
 * 2. An event fires from within this component
 * 3. An async pipe emits a new value
 * 4. You call markForCheck() explicitly"
 *
 * This is critical for enterprise apps with large component trees.
 * It prevents unnecessary re-renders and keeps the app performant.
 * With Signals, Angular's change detection becomes even more efficient
 * because it knows exactly which signals changed.
 *
 * ARCHITECTURAL DECISION: Signal-based loading/error state
 *
 * Instead of a BehaviorSubject, we use signals for loading/error because:
 * 1. Simpler to read in templates (no async pipe for sync state)
 * 2. No subscription management overhead
 * 3. computed() creates derived loading messages automatically
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass,CommonModule],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  // Signal-based state management for the component
  readonly dashboardData = signal<DashboardData | null>(null);
  readonly isLoading = signal(true);
  readonly hasError = signal(false);

  /**
   * takeUntilDestroyed() — Angular v16+ RxJS interop utility
   *
   * Automatically unsubscribes when the component is destroyed.
   * No need for ngOnDestroy() + Subject + takeUntil() boilerplate.
   * Must be called in an injection context (constructor or field initializer),
   * OR you can pass DestroyRef: takeUntilDestroyed(this.destroyRef)
   */
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.dashboardService.getDashboardData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.dashboardData.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.hasError.set(true);
          this.isLoading.set(false);
        },
      });
  }

  // ── Template helper methods (pure, side-effect free) ──────────────────────

  getKpiIconBg(color: string): string {
    const map: Record<string, string> = {
      blue: 'bg-blue-50', green: 'bg-green-50',
      purple: 'bg-purple-50', amber: 'bg-amber-50',
    };
    return map[color] ?? 'bg-gray-50';
  }

  getKpiIconColor(color: string): string {
    const map: Record<string, string> = {
      blue: 'text-blue-600', green: 'text-green-600',
      purple: 'text-purple-600', amber: 'text-amber-600',
    };
    return map[color] ?? 'text-gray-600';
  }

  getActivityBg(type: string): string {
    const map: Record<string, string> = {
      hire: 'bg-green-50', order: 'bg-blue-50',
      stock: 'bg-amber-50', alert: 'bg-red-50',
    };
    return map[type] ?? 'bg-gray-50';
  }

  getActivityColor(type: string): string {
    const map: Record<string, string> = {
      hire: 'text-green-600', order: 'text-blue-600',
      stock: 'text-amber-600', alert: 'text-red-600',
    };
    return map[type] ?? 'text-gray-600';
  }

  getActivityIcon(type: string): string {
    const map: Record<string, string> = {
      hire: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z',
      order: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      stock: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10',
      alert: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    };
    return map[type] ?? '';
  }

  formatTimestamp(iso: string): string {
    const date = new Date(iso);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }
}