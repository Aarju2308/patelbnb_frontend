import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import {provideAnimations} from "@angular/platform-browser/animations";
import { provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { authExpired } from './core/auth/auth-expired.interceptor';
import { ConfirmationService } from 'primeng/api';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([authExpired]),
      withXsrfConfiguration({cookieName : "XSRF_TOKEN", headerName: "X-XSRF-TOKEN"})
    ),
    ConfirmationService, provideAnimationsAsync('noop')]
};
