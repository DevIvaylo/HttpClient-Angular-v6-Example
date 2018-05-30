import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

import {catchError, retry} from 'rxjs/internal/operators';
import {throwError, Observable} from 'rxjs';

export interface Config {
  heroesUrl: string;
  textfile: string;
}


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  configUrl = 'assets/config.json';

  getConfig() {
    return this.http.get(this.configUrl);
  }

  // Observables returned by the HttpClient methods and pipe them through to the error handler.
  getConfig_v1() {
    return this.http.get<Config>(this.configUrl)
      .pipe(
        retry(3), // automatically re-subscribes to a failed Observable a specified number of times
        catchError(this.handleError)
      );
  }

  // Tell HttpClient that you want the full response with the observe option
  // And HttpClient.get() returns an Observable of typed HttpResponse rather than just the JSON data.
  getConfigResponse(): Observable<HttpResponse<Config>> {
    return this.http.get<Config>(this.configUrl, {observe: 'response'});
  }

  // Error inspection, interpretation, and resolution is something you want to do in the service, not in the component.
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred: ', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError('Something bad happened, please try again later.');
  }

  makeIntentionalError(){
    return this.http.get('not/a/real/url')
      .pipe(
        catchError(this.handleError)
      );
  }

}
