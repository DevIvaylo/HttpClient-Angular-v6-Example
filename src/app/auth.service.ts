import {Injectable} from '@angular/core';

/** Mock/simulation client-side authentication/authorization service */
@Injectable()
export class AuthService {
  getAuthorizationToken() {
    return 'some-auth-token';
  }
}
