import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {HttpHeaders} from '@angular/common/http';
import {HandleError, HttpErrorHandler} from '../http-error-handler.service';

import {Observable} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';


// adding interface hero
export interface Hero {
  id: number;
  name: string;
}


// defining header for save operations and auth token
const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  heroesUrl = 'api/heroes'; // url to web api
  private handleError: HandleError;

  constructor(private http: HttpClient,
              httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('HeroesService');
  }


  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        catchError(this.handleError('getHeroes', []))
      );
  }


  /* GET heroes whose name contains search term.
  * If there is a search term, the code constructs an options object with an HTML URL-encoded search parameter.
  * If the term were "foo", the GET request URL would be api/heroes/?name=foo.
  The HttpParams are immutable so you'll have to use the set() method to update the options.
  */
  searchHeroes(term: string): Observable<Hero[]> {
    term = term.trim();

    // Add safe, URL encoded search parameter if there is a search term
    const options = term ?
      {params: new HttpParams().set('name', term)} : {};

    return this.http.get<Hero[]>(this.heroesUrl, options)
      .pipe(
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
  }


  //////// Save methods //////////


  // Post(): adding new hero to the database
  /*The HttpClient.post() method is similar to get() in that it has a type parameter (you're expecting the server to
   return the new hero) and it takes a resource URL.
    It takes two more parameters:
1. hero - the data to POST in the body of the request.
2. httpOptions - the method options which, in this case, specify required headers.
*/
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('addHero', hero))
      );
  }

  /** DELETE: delete the hero from the server.
   This application deletes a hero with the HttpClient.delete method by passing the hero's id in the request URL.*/
  deleteHero(id: number): Observable<{}> {
    const url = `${this.heroesUrl}/${id}`;   // DELETE api/heroes/42
    return this.http.delete(url, httpOptions)
      .pipe(
        catchError(this.handleError('deleteHero'))
      );
  }

  /** PUT: update the hero on the server. Returns the updated hero upon success. */
  updateHero(hero: Hero): Observable<Hero> {

    /*You can't directly modify the existing headers within the previous options object because instances of
     the HttpHeaders class are immutable.
     Use the set() method instead. It returns a clone of the current instance with the new changes applied.
     Here's how you might update the authorization header (after the old token expired) before making the next request.*/
    httpOptions.headers =
      httpOptions.headers.set('Authorization', 'my-new-auth-token');

    return this.http.put<Hero>(this.heroesUrl, hero, httpOptions)
      .pipe(
        catchError(this.handleError('updateHero', hero))
      );
  }
}
