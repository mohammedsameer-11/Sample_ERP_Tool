import {
  Component, input, output, OnChanges, SimpleChanges,
  ChangeDetectionStrategy, inject
} from '@angular/core';
import {
  FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl
} from '@angular/forms';
import { NgClass } from '@angular/common';

import {
  Employee, CreateEmployeeDto, UpdateEmployeeDto,
  DEPARTMENTS, EMPLOYEE_STATUSES, Department, EmployeeStatus
} from '../../../core/models/employee.model';

/**
 * ARCHITECTURAL DECISION: Dumb component with Reactive Forms
 *
 * This component:
 * 1. Receives an employee as an input (null = create mode, Employee = edit mode)
 * 2. Builds/resets the form when the input changes (OnChanges)
 * 3. Emits the form data up via output — the SMART parent handles the service call
 * 4. Has ZERO knowledge of EmployeeService — fully decoupled
 *
 * WHY Reactive Forms over Template-driven:
 * - Fully synchronous — form value is always available, no ExpressionChangedAfterCheck
 * - Easier unit testing — just set form.setValue() and test the output emission
 * - AbstractControl methods (setErrors, markAllAsTouched) are powerful for async validation
 * - The validator composition (Validators.compose) is explicit and easy to explain
 */
@Component({
  selector: 'app-employee-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './employee-form.component.html',
})
export class EmployeeFormComponent implements OnChanges {
  /**
   * ARCHITECTURAL DECISION: inject() in field position
   * FormBuilder is a service — we inject it here instead of the constructor.
   */
  private readonly fb = inject(FormBuilder);

  // Inputs using the new signal-based input() API
  readonly employee = input<Employee | null>(null);   // null = create mode
  readonly isOpen = input.required<boolean>();
  readonly isSaving = input<boolean>(false);

  // Outputs
  readonly save = output<CreateEmployeeDto | UpdateEmployeeDto>();
  readonly close = output<void>();

  // Template constants (from model — single source of truth)
  readonly departments = DEPARTMENTS;
  readonly statuses = EMPLOYEE_STATUSES;

  /**
   * ARCHITECTURAL DECISION: FormBuilder.nonNullable
   *
   * fb.nonNullable.group() ensures every control is typed as T, not T | null.
   * This eliminates the constant null checks that plague Angular forms.
   * Aligns with strict TypeScript mode.
   */
  form: FormGroup = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    lastName:  ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    email:     ['', [Validators.required, Validators.email]],
    phone:     [''],
    department: ['' as Department | '', Validators.required],
    role:      ['', [Validators.required, Validators.minLength(3)]],
    status:    ['active' as EmployeeStatus],
    salary:    [0, [Validators.required, Validators.min(1)]],
    hireDate:  ['', Validators.required],
  });

  /**
   * ngOnChanges fires when @Input() changes — we use it to
   * populate (edit mode) or reset (create mode) the form.
   *
   * Note: With signal inputs (input()), use effect() instead of ngOnChanges.
   * Both approaches shown here so you can explain either in interviews.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] || changes['isOpen']) {
      const emp = this.employee();
      if (emp) {
        // Edit mode: patch form with existing values
        this.form.patchValue({
          firstName:  emp.firstName,
          lastName:   emp.lastName,
          email:      emp.email,
          phone:      emp.phone,
          department: emp.department,
          role:       emp.role,
          status:     emp.status,
          salary:     emp.salary,
          hireDate:   emp.hireDate,
        });
      } else {
        // Create mode: reset to defaults
        this.form.reset({ status: 'active' });
      }
    }
  }

  isEditMode(): boolean {
    return this.employee() !== null;
  }

  /**
   * Checks if a field should show validation errors.
   * Only shows errors after the user has interacted with the field (touched).
   * This prevents showing "required" errors before the user does anything.
   */
  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  /** Maps Angular validation errors to human-readable messages */
  getFieldError(fieldName: string): string {
    const control: AbstractControl | null = this.form.get(fieldName);
    if (!control?.errors) return '';

    const { required, email, minlength, maxlength, min } = control.errors;

    if (required) return `${fieldName.replace(/([A-Z])/g, ' $1')} is required`;
    if (email) return 'Please enter a valid email address';
    if (minlength) return `Minimum ${minlength.requiredLength} characters required`;
    if (maxlength) return `Maximum ${maxlength.requiredLength} characters allowed`;
    if (min) return `Value must be at least ${min.min}`;

    return 'Invalid value';
  }

  handleSubmit(): void {
    /**
     * markAllAsTouched() triggers validation on ALL fields simultaneously.
     * Without this, errors only appear on fields the user actually touched.
     * Calling it on submit ensures everything validates at once.
     */
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Emit the typed DTO — parent handles the actual service call
    this.save.emit(this.form.getRawValue());
  }
}