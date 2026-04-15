import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root component is intentionally minimal — it's just the router host.
 * All real layout lives in ShellComponent, keeping this file clean.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}