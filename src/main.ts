import { enableProdMode, importProvidersFrom } from '@angular/core';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import {ApiService} from "./app/shared-services/api.service";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpTokenInterceptorsService} from "./app/shared-services/authentication/http-token-interceptors.service";

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
      ApiService,
      importProvidersFrom([HttpClientModule, BrowserAnimationsModule, BrowserModule], BrowserAnimationsModule),
      {provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptorsService, multi: true},
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    importProvidersFrom(IonicModule.forRoot({})),
    provideRouter(routes),
  ],
});
