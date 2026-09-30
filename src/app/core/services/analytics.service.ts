import { Injectable } from '@angular/core';

declare function gtag(...args: any[]): void;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  trackEvent(
    eventName: string,
    parameters: Record<string, unknown> = {}
  ): void {
    if (typeof gtag === 'function') {
      gtag('event', eventName, parameters);
    }
  }
}