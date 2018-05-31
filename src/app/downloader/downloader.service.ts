import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {tap} from 'rxjs/internal/operators';
import {MessageService} from '../message.service';

@Injectable({
  providedIn: 'root'
})

export class DownloaderService {
  /* Not all APIs return JSON data. In this next example, a DownloaderService method reads a
   text file from the server and logs the file contents, before returning those contents to the caller as an Observable<string>.
  * */

  constructor(private http: HttpClient,
              private messageService: MessageService) {
  }

  getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.http.get(filename, {responseType: 'text'})
      .pipe(
        tap( // Log the result or error
          data => this.log(filename, data),
          error => this.logError(filename, error)
        )
      );
  }

  private log(filename: string, data: string) {
    const message = `DownloaderService downloaded "${filename}" and got "${data}".`;
    this.messageService.add(message);
  }

  private logError(filename: string, error: any) {
    const message = `DownloaderService failed to download "${filename}", got error "${error.message}".`;
    console.error(message);
    this.messageService.add(message);
  }

}
