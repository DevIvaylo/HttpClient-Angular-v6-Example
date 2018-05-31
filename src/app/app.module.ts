// modules
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

// components
import {AppComponent} from './app.component';
import {ConfigComponent} from './config/config.component';
import {DownloaderComponent} from './downloader/downloader.component';
import { HeroesComponent } from './heroes/heroes.component';

// services
import {ConfigService} from './config/config.service';
import {DownloaderService} from './downloader/downloader.service';

@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    DownloaderComponent,
    HeroesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    ConfigService,
    DownloaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
