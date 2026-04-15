import {
  Component, OnInit, inject, signal, computed, effect, DestroyRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { EmployeeService } from '../../../core/services/employee.service';
import {
  Employee, EmployeeFilter, CreateEmployeeDto, UpdateEmployeeDto,
  DEFAULT_EMPLOYEE_FILTER, DEPARTMENTS, EMPLOYEE_STATUSES, Department, EmployeeStatus
} from '../../../core/models/employee.model';
import { PaginatedResponse } from '../../../core/models/api-response.model';
import { EmployeeTableComponent } from '../employee-table/employee-table.component';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';

/**
 * ARCHITECTURAL DECISION: The Smart Component Pattern
 *
 * This is the "controller" of the employee feature. It:
 * 1. Owns ALL state: filter, pagination, panel visibility, loading, selected employee
 * 2. Injects the EmployeeService (the ONLY component that does)
 * 3. Orchestrates data flow: service → signals → child component inputs
 * 4. Handles all user events bubbled up from dumb child components
 *
 * The template is intentionally minimal for this component — layout + filters.
 * The complex DOM (table, form) lives in dedicated dumb components.
 *
 * ARCHITECTURAL DECISION: switchMap for search/filter debouncing
 *
 * When filter changes, we use a Subject that pipes through:
 * - debounceTime(300): waits for typing to pause (prevents API spam)
 * - distinctUntilChanged: ignores if filter is identical to last emission
 * - switchMap: cancels the previous in-flight request when a new filter arrives
 *
 * This is the correct RxJS pattern for "search as you type" and is what
 * you'd use with a real HttpClient as well.
 */
@Component({
  selector: 'app-employee-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, EmployeeTableComponent, EmployeeFormComponent],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);

  // ── State signals ─────────────────────────────────────────────────────────

  /** The canonical filter object. ALL data re-fetches when this changes. */
  readonly filter = signal<EmployeeFilter>({ ...DEFAULT_EMPLOYEE_FILTER });

  readonly employees = signal<Employee[]>([]);
  readonly totalCount = signal(0);
  readonly isLoading = signal(true);
  readonly isPanelOpen = signal(false);
  readonly isSaving = signal(false);
  readonly selectedEmployee = signal<Employee | null>(null);

  // Local ngModel bindings for filter inputs
  searchInput = '';
  selectedDept: Department | '' = '';
  selectedStatus: EmployeeStatus | '' = '';

  // ── Computed/derived state ─────────────────────────────────────────────────

  /** computed() is memoized — only recalculates when filter() or totalCount() changes */
  readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalCount() / this.filter().pageSize))
  );

  readonly pageStart = computed(() =>
    (this.filter().page - 1) * this.filter().pageSize + 1
  );

  readonly pageEnd = computed(() =>
    Math.min(this.filter().page * this.filter().pageSize, this.totalCount())
  );

  readonly activeCount = computed(() => this.employeeService.activeEmployees());

  readonly hasActiveFilters = computed(() => {
    const f = this.filter();
    return !!(f.search || f.department || f.status);
  });

  /** Generates an array of page numbers with ellipsis (-1) for long ranges */
  readonly visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.filter().page;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: number[] = [1];
    if (current > 3) pages.push(-1);                          // left ellipsis
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push(-1);                  // right ellipsis
    pages.push(total);
    return pages;
  });

  // ── Search debounce subject ───────────────────────────────────────────────

  /**
   * Subject pattern for debounced search:
   * User types → next() fires → debounceTime waits → switchMap cancels old, starts new
   */
  private readonly filterSubject = new Subject<EmployeeFilter>();

  // ── Template constants ───────────────────────────────────────────────────
  readonly departments = DEPARTMENTS;
  readonly statuses = EMPLOYEE_STATUSES;

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.filterSubject.pipe(
      debounceTime(300),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      /**
       * switchMap: when a new filter arrives, CANCEL the previous observable
       * and subscribe to the new one. Prevents stale responses from
       * overwriting newer results (race condition prevention).
       */
      switchMap(filter => {
        this.isLoading.set(true);
        return this.employeeService.getAll(filter);
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response: PaginatedResponse<Employee>) => {
        this.employees.set(response.data);
        this.totalCount.set(response.totalCount);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });

    // Trigger initial load
    this.filterSubject.next(this.filter());
  }

  // ── Filter handlers ───────────────────────────────────────────────────────

  onSearchChange(value: string): void {
    this.updateFilter({ search: value, page: 1 });
  }

  onDeptChange(dept: Department | ''): void {
    this.updateFilter({ department: dept, page: 1 });
  }

  onStatusChange(status: EmployeeStatus | ''): void {
    this.updateFilter({ status, page: 1 });
  }

  onSort(key: string): void {
    const current = this.filter();
    // If clicking the same column, toggle direction; otherwise sort ASC
    const sortDir = current.sortBy === key && current.sortDir === 'asc' ? 'desc' : 'asc';
    this.updateFilter({ sortBy: key as keyof Employee, sortDir, page: 1 });
  }

  clearFilters(): void {
    this.searchInput = '';
    this.selectedDept = '';
    this.selectedStatus = '';
    this.updateFilter({ search: '', department: '', status: '', page: 1 });
  }

  goToPage(page: number): void {
    const total = this.totalPages();
    if (page < 1 || page > total) return;
    this.updateFilter({ page });
  }

  onPageSizeChange(event: Event): void {
    const pageSize = Number((event.target as HTMLSelectElement).value);
    this.updateFilter({ pageSize, page: 1 });
  }

  // ── CRUD handlers ─────────────────────────────────────────────────────────

  openCreatePanel(): void {
    this.selectedEmployee.set(null);
    this.isPanelOpen.set(true);
  }

  openEditPanel(employee: Employee): void {
    this.selectedEmployee.set(employee);
    this.isPanelOpen.set(true);
  }

  closePanelWithConfirm(): void {
    // In production you'd check form.dirty and show a confirmation dialog
    this.isPanelOpen.set(false);
    this.selectedEmployee.set(null);
  }

  onSave(dto: CreateEmployeeDto | UpdateEmployeeDto): void {
    this.isSaving.set(true);
    const emp = this.selectedEmployee();

    const operation$ = emp
      ? this.employeeService.update(emp.id, dto as UpdateEmployeeDto)
      : this.employeeService.create(dto as CreateEmployeeDto);

    operation$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.isPanelOpen.set(false);
        this.selectedEmployee.set(null);
        // Refresh the list — signal in service updated, re-fetch matches new state
        this.filterSubject.next(this.filter());
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  onDelete(id: string): void {
    // In production: show a confirm dialog before deleting
    if (!confirm('Are you sure you want to delete this employee?')) return;

    this.employeeService.delete(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        // If we deleted the last item on a non-first page, go back a page
        const newTotal = this.totalCount() - 1;
        const newTotalPages = Math.ceil(newTotal / this.filter().pageSize);
        const shouldGoBack = this.filter().page > newTotalPages && newTotalPages > 0;
        this.updateFilter({ page: shouldGoBack ? newTotalPages : this.filter().page });
      });
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private updateFilter(partial: Partial<EmployeeFilter>): void {
    /**
     * signal.update() is atomic — it reads the current value and produces a new object.
     * We NEVER mutate the existing filter object (immutability).
     * The spread creates a new reference, which satisfies OnPush change detection.
     */
    this.filter.update(current => ({ ...current, ...partial }));
    this.filterSubject.next(this.filter());
  }
}