import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

/**
 * ARCHITECTURAL DECISION: Standalone Application Config (no AppModule)
 *
 * Angular v17+ replaces NgModule-based bootstrapping with this functional
 * approach. Benefits for interviews:
 * 1. Explicit provider registration — no hidden imports from NgModule
 * 2. Better tree-shaking: only what you list is bundled
 * 3. provideAnimationsAsync() loads the animation engine lazily (free perf win)
 *
 * withComponentInputBinding() lets us bind route params directly to
 * @Input() properties on components — no need to inject ActivatedRoute manually.
 *
 * withViewTransitions() enables native browser View Transition API animations
 * between routes — Angular v17+ feature, impressive in demos.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
    provideAnimationsAsync(),
  ],
};