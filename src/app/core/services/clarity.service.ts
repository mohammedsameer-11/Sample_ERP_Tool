import { Injectable } from '@angular/core';
import Clarity from '@microsoft/clarity';

@Injectable({
  providedIn: 'root'
})
export class ClarityService {

  initialize(): void {
    const projectId = 'ypr42r69x7';

    Clarity.init(projectId);
  }

  identify(
    customId: string,
    customSessionId?: string,
    customPageId?: string,
    friendlyName?: string
  ): void {
    Clarity.identify(
      customId,
      customSessionId,
      customPageId,
      friendlyName
    );
  }

  setTag(key: string, value: string | string[]): void {
    Clarity.setTag(key, value);
  }

  trackEvent(eventName: string): void {
    Clarity.event(eventName);
  }
}