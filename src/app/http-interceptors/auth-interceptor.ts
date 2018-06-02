import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';

import {AuthService} from '../auth.service';

/*An interceptor that alters headers can be used for a number of different operations, including:
  -Authentication/authorization
  -Caching behavior; for example, If-Modified-Since
  -XSRF protection
  */


/*Apps often use an interceptor to set default headers on outgoing requests.
The sample app has an AuthService that produces an authorization token.
Here is its AuthInterceptor that injects that service to get the token and adds an authorization header with that
 token to every outgoing request.
*/
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const authToken = this.auth.getAuthorizationToken();

    /*
    * The verbose way:
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', authToken)
    });
    */
    // Clone the request and set the new header in one step.
    const authReq = req.clone({setHeaders: {Authorization: authToken}});

    // send cloned request with header to the next handler.
    return next.handle(authReq);

  }

}
