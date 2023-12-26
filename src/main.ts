import {enableProdMode, importProvidersFrom, isDevMode} from '@angular/core';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {
    RouteReuseStrategy,
    provideRouter,
    withPreloading,
    PreloadAllModules
} from '@angular/router';
import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {ApiService} from "./app/shared-services/api.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpTokenInterceptorsService} from "./app/shared-services/authentication/http-token-interceptors.service";
import { provideServiceWorker } from '@angular/service-worker';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
    ApiService,
    importProvidersFrom([HttpClientModule, BrowserAnimationsModule, BrowserModule], BrowserAnimationsModule),
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptorsService, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    // Important: We are using PreloadModules to load all the modules after first load
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
});
