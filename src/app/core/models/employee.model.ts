/**
 * Strict TypeScript typing is intentional here.
 * - Union string literals for status/department = no magic strings in templates
 * - Readonly arrays for constant sets = prevents accidental mutation
 * - The DEPARTMENTS/STATUSES arrays are exported for use in form dropdowns,
 *   ensuring the UI and model are always in sync
 */

export type EmployeeStatus = 'active' | 'inactive' | 'on-leave';
export type Department =
  | 'Engineering'
  | 'Human Resources'
  | 'Sales'
  | 'Finance'
  | 'Marketing'
  | 'Operations';

export interface Employee {
  readonly id: string;          // Immutable after creation (server-generated)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  role: string;
  status: EmployeeStatus;
  salary: number;
  hireDate: string;             // ISO 8601 string — serialize to/from .NET DateTime
  managerId?: string;           // Self-referencing FK (nullable)
  readonly createdAt: string;
}

/** Convenience computed type — what the form submits (no server-managed fields) */
export type CreateEmployeeDto = Omit<Employee, 'id' | 'createdAt'>;
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

/** Filter state — aligns with query params you'd send to a real API */
export interface EmployeeFilter {
  search: string;
  department: Department | '';
  status: EmployeeStatus | '';
  page: number;
  pageSize: number;
  sortBy: keyof Employee;
  sortDir: 'asc' | 'desc';
}

// These arrays drive the dropdown options in the form component.
// Single source of truth: change here and both model validation and UI update.
export const DEPARTMENTS: Department[] = [
  'Engineering', 'Human Resources', 'Sales', 'Finance', 'Marketing', 'Operations'
];

export const EMPLOYEE_STATUSES: { value: EmployeeStatus; label: string }[] = [
  { value: 'active',    label: 'Active'   },
  { value: 'inactive',  label: 'Inactive' },
  { value: 'on-leave',  label: 'On Leave' },
];

export const DEFAULT_EMPLOYEE_FILTER: EmployeeFilter = {
  search: '',
  department: '',
  status: '',
  page: 1,
  pageSize: 10,
  sortBy: 'lastName',
  sortDir: 'asc',
};