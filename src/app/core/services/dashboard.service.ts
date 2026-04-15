import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

import { EmployeeService } from './employee.service';
import { ProductService } from './product.service';
import { DashboardData, KpiMetric, MonthlySales, ActivityItem } from '../models/dashboard.model';

const MONTHLY_SALES: MonthlySales[] = [
  { month: 'Jul', revenue: 4200000, orders: 312, expenses: 2800000 },
  { month: 'Aug', revenue: 5100000, orders: 389, expenses: 3100000 },
  { month: 'Sep', revenue: 4750000, orders: 341, expenses: 2950000 },
  { month: 'Oct', revenue: 6300000, orders: 428, expenses: 3400000 },
  { month: 'Nov', revenue: 7800000, orders: 512, expenses: 4100000 },
  { month: 'Dec', revenue: 9200000, orders: 634, expenses: 5200000 },
  { month: 'Jan', revenue: 6100000, orders: 445, expenses: 3600000 },
  { month: 'Feb', revenue: 5800000, orders: 421, expenses: 3300000 },
  { month: 'Mar', revenue: 7200000, orders: 531, expenses: 3900000 },
  { month: 'Apr', revenue: 8100000, orders: 589, expenses: 4200000 },
  { month: 'May', revenue: 7600000, orders: 562, expenses: 4000000 },
  { month: 'Jun', revenue: 8900000, orders: 641, expenses: 4500000 },
];

const RECENT_ACTIVITY: ActivityItem[] = [
  { id: 'act-1', type: 'hire',  message: 'New employee Ananya Krishnan joined Engineering', timestamp: '2024-06-15T10:30:00Z' },
  { id: 'act-2', type: 'order', message: 'Purchase Order #PO-2024-0891 approved — ₹2.4L', timestamp: '2024-06-15T09:15:00Z' },
  { id: 'act-3', type: 'stock', message: 'Low stock alert: Dell Monitor 27" (8 units remaining)', timestamp: '2024-06-14T16:45:00Z' },
  { id: 'act-4', type: 'alert', message: 'Q4 Sales target exceeded by 12%', timestamp: '2024-06-14T12:00:00Z' },
  { id: 'act-5', type: 'hire',  message: 'Vikram Singh returned from leave', timestamp: '2024-06-13T09:00:00Z' },
];

/**
 * ARCHITECTURAL DECISION: inject() function over constructor injection
 *
 * Angular v14+ supports the inject() function in class fields, which:
 * 1. Removes boilerplate constructor parameters
 * 2. Works in standalone functions and injection contexts
 * 3. Allows tree-shaking of unused dependencies
 * 4. Is the Angular team's recommended modern pattern
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  // Using inject() — the Angular v21 idiomatic approach
  private readonly employeeService = inject(EmployeeService);
  private readonly productService = inject(ProductService);

  /**
   * Mimics: GET /api/dashboard/summary
   *
   * Uses combineLatest to "join" data from multiple sources —
   * mirrors how a .NET controller might call multiple services
   * in parallel using Task.WhenAll()
   */
  getDashboardData(): Observable<DashboardData> {
    return combineLatest([
      of(MONTHLY_SALES).pipe(delay(300)),
      of(RECENT_ACTIVITY).pipe(delay(200)),
    ]).pipe(
      map(([monthlySales, recentActivity]) => {
        // Derive KPIs from live signal values (no extra HTTP call needed)
        const totalEmployees = this.employeeService.totalEmployees();
        const activeEmployees = this.employeeService.activeEmployees();
        const totalProducts = this.productService.totalProducts();
        const lowStockCount = this.productService.lowStockCount();

        const currentRevenue = monthlySales[monthlySales.length - 1].revenue;
        const prevRevenue = monthlySales[monthlySales.length - 2].revenue;
        const revenueChange = ((currentRevenue - prevRevenue) / prevRevenue) * 100;

        const kpis: KpiMetric[] = [
          {
            id: 'total-revenue',
            label: 'Monthly Revenue',
            value: currentRevenue,
            formattedValue: `₹${(currentRevenue / 100000).toFixed(1)}L`,
            change: Math.round(revenueChange * 10) / 10,
            trend: revenueChange >= 0 ? 'up' : 'down',
            iconName: 'currency',
            accentColor: 'blue',
          },
          {
            id: 'active-employees',
            label: 'Active Employees',
            value: activeEmployees,
            formattedValue: String(activeEmployees),
            change: 4.2,
            trend: 'up',
            iconName: 'users',
            accentColor: 'green',
          },
          {
            id: 'total-orders',
            label: 'Orders This Month',
            value: monthlySales[monthlySales.length - 1].orders,
            formattedValue: String(monthlySales[monthlySales.length - 1].orders),
            change: 2.1,
            trend: 'up',
            iconName: 'orders',
            accentColor: 'purple',
          },
          {
            id: 'low-stock',
            label: 'Low Stock Alerts',
            value: lowStockCount,
            formattedValue: String(lowStockCount),
            change: -15,
            trend: lowStockCount > 3 ? 'down' : 'flat',
            iconName: 'alert',
            accentColor: 'amber',
          },
        ];

        const departmentHeadcount = [
          { department: 'Engineering',     count: 4, color: '#6366F1' },
          { department: 'Human Resources', count: 1, color: '#22C55E' },
          { department: 'Sales',           count: 2, color: '#F59E0B' },
          { department: 'Finance',         count: 2, color: '#3B82F6' },
          { department: 'Marketing',       count: 1, color: '#EC4899' },
          { department: 'Operations',      count: 1, color: '#14B8A6' },
        ];

        return { kpis, monthlySales, departmentHeadcount, recentActivity };
      })
    );
  }
}