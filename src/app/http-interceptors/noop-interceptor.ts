import {Injectable} from '@angular/core';
import {HttpEvent, HttpInterceptor, HttpRequest, HttpHandler} from '@angular/common/http';

import {Observable} from 'rxjs';


/** Pass untouched request through to the next request handler.
 * To implement an interceptor, declare a class that implements the intercept() method of the HttpInterceptor interface.
 Here is a do-nothing noop interceptor that simply passes the request through without touching it.
 The intercept method transforms a request into an Observable that eventually returns the HTTP response. In this sense, each interceptor  is fully capable of handling the request entirely by itself.
 Most interceptors inspect the request on the way in and forward the (perhaps altered) request to the handle() method of the next object, which implements the HttpHandler interface.*/
@Injectable({
  providedIn: 'root'
})
export class NoopInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
