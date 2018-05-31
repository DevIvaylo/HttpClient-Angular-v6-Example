import {Component} from '@angular/core';
import {ConfigService, Config} from './config.service';

@Component({
  selector: 'app-config',
  providers: [ConfigService],
  template: `
    <h3>Get configuration from JSON file</h3>
    <div>
      <button (click)="clear(); showConfig()">Get</button>
      <button (click)="clear(); showConfigResponse()">Get Response</button>
      <button (click)="clear()">Clear</button>
      <button (click)="clear(); makeError()">Error</button>
      <span *ngIf="config">
        <p>Heroes API URL is "{{config.heroesUrl}}"</p>
        <p>Textfile URL is "{{config.textfile}}"</p>
      <div *ngIf="headers">
        Response headers:
        <ul>
          <li *ngFor="let header of headers">{{header}}</li>
        </ul>
      </div>
      </span>
    </div>
    <p *ngIf="error" class="error">{{error | json}}</p>
  `,
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  error: any;
  config: Config;
  headers: string[];

  constructor(private configService: ConfigService) {
  }

  clear() {
    this.error = undefined;
    this.config = undefined;
    this.headers = undefined;
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Config) => this.config = {
        heroesUrl: data['heroesUrl'],
        textfile: data['textfile']
      });
  }


  showConfig_v1() {
    this.configService.getConfig_v1()
    // clone the data object, using its known Config shape model
      .subscribe((data: Config) => this.config = {...data},
        error => this.error = error);
  }

  // showConfigResponse() method displays the response headers as well as the configuration:
  showConfigResponse() {
    this.configService.getConfigResponse()
    // resp is of type `HttpResponse<Config>`
      .subscribe(resp => {
        // display its headers
        const keys = resp.headers.keys();
        this.headers = keys.map(key =>
          `${key}: ${resp.headers.get(key)}`);

        // access the body directly, which is typed as `Config`.
        this.config = {...resp.body};
      });
  }

  makeError() {
    this.configService.makeIntentionalError().subscribe(null, error => this.error = error);
  }
}
