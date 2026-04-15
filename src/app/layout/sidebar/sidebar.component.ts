import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;  // SVG path data
}

/**
 * ARCHITECTURAL DECISION: input() signal API (Angular v17+)
 *
 * input() replaces the @Input() decorator. Benefits:
 * 1. Returns a Signal<T> — templates can read it without async pipe
 * 2. Type-safe: input.required<boolean>() throws at compile time if not passed
 * 3. Can be used in computed() to derive values
 *
 * output() replaces @Output() + EventEmitter. It's a simpler API that
 * integrates cleanly with the signals mental model.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  // input() signal — reads as collapsed() in the template
  readonly collapsed = input.required<boolean>();
  readonly toggleCollapse = output<void>();

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      label: 'Employees',
      route: '/employees',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
    {
      label: 'Inventory',
      route: '/inventory',
      icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    },
  ];
}