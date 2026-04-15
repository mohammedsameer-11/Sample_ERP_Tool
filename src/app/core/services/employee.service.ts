import { Injectable, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { Employee, EmployeeFilter, CreateEmployeeDto, UpdateEmployeeDto } from '../models/employee.model';
import { PaginatedResponse, ApiResponse } from '../models/api-response.model';
import { MOCK_EMPLOYEES } from './mock-data/employees.mock';

/**
 * ARCHITECTURAL DECISION: providedIn: 'root' (Application-scoped singleton)
 *
 * This service is a singleton in the root injector, meaning one instance
 * exists for the entire app lifecycle. This is intentional because:
 * 1. The signal-based `store` must be a single source of truth
 * 2. It mirrors how a .NET IRepository<Employee> would be scoped per-request
 *    but a cache/unit-of-work would be application-scoped
 *
 * ARCHITECTURAL DECISION: signal() for the in-memory store
 *
 * We use Angular's signal() instead of a BehaviorSubject for the store because:
 * 1. Signals are synchronous — no need for subscribe() for reads
 * 2. Automatic change detection (Zone-free compatible)
 * 3. computed() creates derived state without extra pipes
 * 4. Aligns with Angular's future direction (signals-first architecture)
 */
@Injectable({ providedIn: 'root' })
export class EmployeeService {

  /** Private mutable store. Components NEVER touch this directly. */
  private readonly store = signal<Employee[]>([...MOCK_EMPLOYEES]);

  // ── Derived/computed state ────────────────────────────────────────────────

  /** Reactive count — automatically updates when store changes */
  readonly totalEmployees = computed(() => this.store().length);
  readonly activeEmployees = computed(() =>
    this.store().filter(e => e.status === 'active').length
  );

  // ── HTTP-mirroring methods ────────────────────────────────────────────────

  /**
   * Mimics: GET /api/employees?page=1&pageSize=10&search=sarah&department=Engineering
   *
   * Returns Observable<PaginatedResponse<Employee>> with:
   * 1. Server-side filtering (search, department, status)
   * 2. Server-side sorting
   * 3. Server-side pagination
   * 4. 400ms simulated latency to force loading state handling in components
   *
   * The delay(400) call is crucial for portfolio demos — it shows employers
   * that you handle async states (loading spinners, skeleton screens) properly.
   */
  getAll(filter: EmployeeFilter): Observable<PaginatedResponse<Employee>> {
    return of(this.store()).pipe(
      delay(400),
      map(employees => {
        // Step 1: Filter (equivalent to WHERE clause in SQL / LINQ)
        let result = employees.filter(emp => {
          const q = filter.search.toLowerCase();

          const matchesSearch =
            !q ||
            emp.firstName.toLowerCase().includes(q) ||
            emp.lastName.toLowerCase().includes(q) ||
            emp.email.toLowerCase().includes(q) ||
            emp.role.toLowerCase().includes(q);

          const matchesDept =
            !filter.department || emp.department === filter.department;

          const matchesStatus =
            !filter.status || emp.status === filter.status;

          return matchesSearch && matchesDept && matchesStatus;
        });

        // Step 2: Sort (equivalent to ORDER BY in SQL)
        const sortKey = filter.sortBy;
        result = [...result].sort((a, b) => {
          const aVal = String(a[sortKey] ?? '').toLowerCase();
          const bVal = String(b[sortKey] ?? '').toLowerCase();
          const dir = filter.sortDir === 'asc' ? 1 : -1;
          return aVal < bVal ? -dir : aVal > bVal ? dir : 0;
        });

        // Step 3: Calculate total BEFORE paginating (needed for pagination UI)
        const totalCount = result.length;
        const totalPages = Math.ceil(totalCount / filter.pageSize);

        // Step 4: Paginate (equivalent to OFFSET/FETCH or Skip().Take() in EF Core)
        const start = (filter.page - 1) * filter.pageSize;
        const data = result.slice(start, start + filter.pageSize);

        return { data, totalCount, totalPages, page: filter.page, pageSize: filter.pageSize };
      })
    );
  }

  /** Mimics: GET /api/employees/:id */
  getById(id: string): Observable<ApiResponse<Employee | undefined>> {
    const found = this.store().find(e => e.id === id);
    return of({ data: found, totalCount: 1, page: 1, pageSize: 1 }).pipe(delay(200));
  }

  /**
   * Mimics: POST /api/employees
   *
   * ARCHITECTURAL DECISION: Optimistic store update
   * We update the signal store synchronously before the Observable resolves.
   * In a real app with HTTP, you'd use optimistic updates + rollback on error.
   * Here it simplifies the demo while teaching the pattern.
   */
  create(dto: CreateEmployeeDto): Observable<ApiResponse<Employee>> {
    const newEmployee: Employee = {
      ...dto,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Update the signal store — all computed() values re-derive automatically
    this.store.update(list => [...list, newEmployee]);

    return of({ data: newEmployee, totalCount: 1, page: 1, pageSize: 1, success: true })
      .pipe(delay(350));
  }

  /** Mimics: PUT /api/employees/:id */
  update(id: string, dto: UpdateEmployeeDto): Observable<ApiResponse<Employee>> {
    let updated!: Employee;

    this.store.update(list =>
      list.map(emp => {
        if (emp.id === id) {
          updated = { ...emp, ...dto };
          return updated;
        }
        return emp;
      })
    );

    return of({ data: updated, totalCount: 1, page: 1, pageSize: 1, success: true })
      .pipe(delay(350));
  }

  /** Mimics: DELETE /api/employees/:id */
  delete(id: string): Observable<ApiResponse<null>> {
    this.store.update(list => list.filter(e => e.id !== id));
    return of({ data: null, totalCount: 0, page: 1, pageSize: 1, success: true })
      .pipe(delay(200));
  }
}