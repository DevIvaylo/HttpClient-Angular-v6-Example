/* "Barrel" of Http Interceptors */
import {HTTP_INTERCEPTORS} from '@angular/common/http';

import {NoopInterceptor} from './noop-interceptor';
import {AuthInterceptor} from './auth-interceptor';
import {EnsureHttpsInterceptor} from './ensure-https-interceptor';
import {LoggingInterceptor} from './logging-interceptor';
import {TrimNameInterceptor} from './trim-name-interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  /*Note the multi: true option. This required setting tells Angular that HTTP_INTERCEPTORS is a token for a multiprovider that injects an array of values, rather than a single value.*/
  {provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: EnsureHttpsInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
  {provide: HTTP_INTERCEPTORS, useClass: TrimNameInterceptor, multi: true},
];
