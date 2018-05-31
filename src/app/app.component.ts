import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showConfig = false;
  showDownloader = false;
  showHeroes = false;

  toggleConfig() {
    this.showConfig = !this.showConfig;
  }

  toggleDownloader() {
    this.showDownloader = !this.showDownloader;
  }

  toggleHeroes() {
    this.showHeroes = !this.showHeroes;
  }
}
