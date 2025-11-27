import {
  withInterceptorsFromDi,
  provideHttpClient,
} from '@angular/common/http';
import {
  enableProdMode,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';

import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the application is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000',
      })
    ),
    provideHttpClient(withInterceptorsFromDi()),
  ],
}).catch((err) => console.error(err));
