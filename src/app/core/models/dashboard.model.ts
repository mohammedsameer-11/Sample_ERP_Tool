export interface KpiMetric {
  id: string;
  label: string;
  value: number;
  formattedValue: string;     // Pre-formatted for display (e.g., "₹12.4L", "247")
  change: number;             // Percentage change vs last period (positive = up)
  trend: 'up' | 'down' | 'flat';
  iconName: string;           // Maps to an SVG icon key in the template
  accentColor: string;        // Tailwind color class for the card accent
}

export interface MonthlySales {
  month: string;              // "Jan", "Feb", etc.
  revenue: number;
  orders: number;
  expenses: number;
}

export interface DepartmentHeadcount {
  department: string;
  count: number;
  color: string;              // For chart rendering
}

export interface DashboardData {
  kpis: KpiMetric[];
  monthlySales: MonthlySales[];
  departmentHeadcount: DepartmentHeadcount[];
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'hire' | 'order' | 'stock' | 'alert';
  message: string;
  timestamp: string;
}