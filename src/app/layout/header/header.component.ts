import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  readonly sidebarCollapsed = input.required<boolean>();
  readonly toggleSidebar = output<void>();
}