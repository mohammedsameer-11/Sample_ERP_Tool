import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClarityService } from './core/services/clarity.service';

/**
 * Root component is intentionally minimal — it's just the router host.
 * All real layout lives in ShellComponent, keeping this file clean.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {
  constructor(private clarityService: ClarityService) {
    this.clarityService.initialize();
  }
}
