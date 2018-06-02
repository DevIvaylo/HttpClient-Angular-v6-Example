import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpResponse} from '@angular/common/http';

import {tap, finalize} from 'rxjs/internal/operators';

import {MessageService} from '../message.service';

/*
Because interceptors can process the request and response together, they can do things like time and log an entire HTTP operation.
Consider the following LoggingInterceptor, which captures the time of the request, the time of the response,
and logs the outcome with the elapsed time with the injected MessageService.
The RxJS tap operator captures whether the request succeed or failed. The RxJS finalize operator is called when the
response observable either errors or completes (which it must), and reports the outcome to the MessageService.
*/

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor(private messenger: MessageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let ok: string;

    // extend server response observable with logging
    return next.handle(req)
      .pipe(
        tap(
          // Succeeds when there is a response; ignore other events
          event => ok = event instanceof HttpResponse ? 'succeeded' : '',
          error => ok = 'failed'
        ),
        // Log when response observable either completes or errors
        finalize(() => {
          const elapsed = Date.now() - started;
          const msg = `${req.method} "${req.urlWithParams}" ${ok} in ${elapsed} ms.`;
          this.messenger.add(msg);
        })
      );
  }
}
