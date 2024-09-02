import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {HttpClientModule, provideHttpClient} from "@angular/common/http";
import {graphqlProvider} from "./graphql.provider";
import {TokenInjectorInterceptorProvider} from "./core/interceptors/http.interceptor";
import {Apollo} from "apollo-angular";

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    TokenInjectorInterceptorProvider,
    graphqlProvider,
    Apollo,
    provideHttpClient()
  ]
};
