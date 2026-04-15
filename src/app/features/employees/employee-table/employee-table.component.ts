import {
  Component, input, output, ChangeDetectionStrategy
} from '@angular/core';
import { NgClass } from '@angular/common';

import { Employee, EmployeeFilter } from '../../../core/models/employee.model';

/**
 * ARCHITECTURAL DECISION: Pure Presentational (Dumb) Component
 *
 * This table component has NO injected services, NO HTTP calls, NO business logic.
 * It simply renders whatever data it receives and emits user actions upward.
 *
 * Benefits:
 * 1. Testable in isolation: just pass mock Employee[] and check the rendered DOM
 * 2. Reusable: could display employees from any source (search results, org chart, etc.)
 * 3. Predictable: given the same inputs, always produces the same output
 * 4. OnPush is safe: inputs are immutable references (new array on each service response)
 */
@Component({
  selector: 'app-employee-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  templateUrl: './employee-table.component.html',
})
export class EmployeeTableComponent {
  // All data flows IN via input signals
  readonly employees = input.required<Employee[]>();
  readonly isLoading = input<boolean>(false);
  readonly currentFilter = input.required<EmployeeFilter>();

  // All actions flow OUT via outputs
  readonly sort = output<string>();
  readonly editEmployee = output<Employee>();
  readonly deleteEmployee = output<string>();  // emits employee id

  readonly columns = [
    { key: 'lastName',   label: 'Employee',   sortable: true,  skeletonWidth: '70%' },
    { key: 'department', label: 'Department', sortable: true,  skeletonWidth: '60%' },
    { key: 'role',       label: 'Role',       sortable: false, skeletonWidth: '80%' },
    { key: 'status',     label: 'Status',     sortable: true,  skeletonWidth: '40%' },
    { key: 'salary',     label: 'Salary',     sortable: true,  skeletonWidth: '35%' },
    { key: 'hireDate',   label: 'Hired',      sortable: true,  skeletonWidth: '50%' },
  ];

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'active':   'bg-green-50 text-green-700',
      'inactive': 'bg-gray-100 text-gray-600',
      'on-leave': 'bg-amber-50 text-amber-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  getStatusDotClass(status: string): string {
    const map: Record<string, string> = {
      'active':   'bg-green-500',
      'inactive': 'bg-gray-400',
      'on-leave': 'bg-amber-500',
    };
    return map[status] ?? 'bg-gray-400';
  }

  formatStatus(status: string): string {
    return status.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }
}