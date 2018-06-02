import {Injectable} from '@angular/core';
import {HttpRequest, HttpResponse, HttpHandler, HttpInterceptor, HttpEvent, HttpHeaders} from '@angular/common/http';

import {Observable, of} from 'rxjs';
import {startWith, tap} from 'rxjs/internal/operators';

import {RequestCache} from '../request-cache.service';
import {searchUrl} from '../package-search/package-search.service';

/*Interceptors can handle requests by themselves, without forwarding to next.handle().
For example, you might decide to cache certain requests and responses to improve performance.
You can delegate caching to an interceptor without disturbing your existing data services.
The CachingInterceptor demonstrates this approach.
*/


/**
 * If request is cachable (e.g., package search) and
 * response is in cache return the cached response as observable.
 * If has 'x-refresh' header that is true,
 * then also re-run the package search, using response from next(),
 * returning an observable that emits the cached response first.
 *
 * If not in cache or not cachable,
 * pass request through to next()
 */
@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // continue if not cachable.
    if (!isCachable(req)) {
      return next.handle(req);
    }

    const cachedResponse = this.cache.get(req);
    // cache-then-refresh
    if (req.headers.get('x-refresh')) {
      const results$ = sendRequest(req, next, this.cache);
      return cachedResponse ?
        results$.pipe(startWith(cachedResponse)) :
        results$;
    }
    // cache-or-fetch
    return cachedResponse ?
      of(cachedResponse) : sendRequest(req, next, this.cache);
  }
}


/** Is this request cachable? */
function isCachable(req: HttpRequest<any>) {
  // Only GET requests are cachable
  return req.method === 'GET' &&
    // Only npm package search is cachable in this app
    -1 < req.url.indexOf(searchUrl);
}

/**
 * Get server response observable by sending request to `next()`.
 * Will add the response to the cache on the way out.
 */
function sendRequest(req: HttpRequest<any>,
                     next: HttpHandler,
                     cache: RequestCache): Observable<HttpEvent<any>> {

  // No headers allowed in npm search request
  const noHeaderReq = req.clone({headers: new HttpHeaders()});

  return next.handle(noHeaderReq).pipe(
    tap(event => {
      // There may be other events besides the response.
      if (event instanceof HttpResponse) {
        cache.put(req, event); // Update the cache.
      }
    })
  );
}


/*
The isCachable() function determines if the request is cachable. In this sample, only GET requests to the npm package
 search api are cachable.
If the request is not cachable, the interceptor simply forwards the request to the next handler in the chain.
If a cachable request is found in the cache, the interceptor returns an of() observable with the cached response,
by-passing the next handler (and all other interceptors downstream).
If a cachable request is not in cache, the code calls sendRequest.
The sendRequest function creates a request clone without headers because the npm api forbids them.
It forwards that request to next.handle() which ultimately calls the server and returns the server's response.
Note how sendRequest intercepts the response on its way back to the application. It pipes the response through
 the tap() operator, whose callback adds the response to the cache.
The original response continues untouched back up through the chain of interceptors to the application caller.
Data services, such as PackageSearchService, are unaware that some of their HttpClient requests actually return cached responses.

A checkbox on the PackageSearchComponent toggles a withRefresh flag, which is one of the arguments to PackageSearchService.search().
 That search() method creates the custom x-refresh header and adds it to the request before calling HttpClient.get().

The revised CachingInterceptor sets up a server request whether there's a cached value or not, using the same
sendRequest() method described above. The results$ observable will make the request when subscribed.
If there's no cached value, the interceptor returns results$.

If there is a cached value, the code pipes the cached response onto results$, producing a recomposed observable that emits twice,
 the cached response first (and immediately), followed later by the response from the server. Subscribers see a
  sequence of two responses.
*/
