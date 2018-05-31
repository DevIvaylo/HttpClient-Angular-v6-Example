import {Component} from '@angular/core';
import {DownloaderService} from './downloader.service';

@Component({
  selector: 'app-downloader',
  template: `
    <h3>Download the textfile</h3>
    <button (click)="download()">Download</button>
    <button (click)="clear()">Clear</button>
    <p *ngIf="contents">Contents: {{contents}}</p>
  `,
  styleUrls: ['./downloader.component.css'],
  providers: [DownloaderService]
})
export class DownloaderComponent {

  contents: string;

  constructor(private downloaderService: DownloaderService) {
  }

  //  download() method initiates the request by subscribing to the service method.
  download() {
    this.downloaderService.getTextFile('assets/textfile.txt')
      .subscribe(results => this.contents = results);
  }

  clear() {
    this.contents = undefined;
  }
}
