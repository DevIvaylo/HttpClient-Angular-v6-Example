import {Injectable} from '@angular/core';
import {HttpEvent, HttpRequest, HttpHandler, HttpInterceptor} from '@angular/common/http';

import {Observable} from 'rxjs';


/* To alter the request, clone it first and modify the clone before passing it to next.handle()
 You can clone and modify the request in a single step as in this example.
 The clone() method's hash argument allows you to mutate specific properties of the request while copying the others.
 */
@Injectable()
export class EnsureHttpsInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // clone request and replace 'http://' with 'https://' at the same time
    const secureReq = req.clone({
      url: req.url.replace('http://', 'https://')
    });
    // send the cloned, 'secure' request to the next handler.
    return next.handle(secureReq);
  }
}
