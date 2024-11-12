import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { reducers, metaReducers } from './state';
import { AuthEffects } from './state/auth/auth.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserAnimationsModule),
    provideAnimations(),
    provideAnimationsAsync(),
    provideCharts(withDefaultRegisterables()),
    MessageService,
    provideStore(),
    provideStoreDevtools(),
    provideStore(reducers, { metaReducers }),
    provideEffects(AuthEffects),
  ],
};
