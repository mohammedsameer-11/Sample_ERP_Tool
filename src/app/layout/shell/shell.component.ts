import { Component, signal } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-shell',
    // 👇 Angular must statically resolve everything here
    imports: [
    RouterOutlet,
    SidebarComponent,
    HeaderComponent
],
    templateUrl: './shell.component.html'
})
export class ShellComponent {

  readonly isSidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(v => !v);
  }

}