// modules
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';

// components
import {AppComponent} from './app.component';
import {ConfigComponent} from './config/config.component';
import {DownloaderComponent} from './downloader/downloader.component';
import {HeroesComponent} from './heroes/heroes.component';

// services
import {ConfigService} from './config/config.service';
import {DownloaderService} from './downloader/downloader.service';
import {HeroesService} from './heroes/heroes.service';
import {HttpErrorHandler} from './http-error-handler.service';
import { PackageSearchComponent } from './package-search/package-search.component';


@NgModule({
  declarations: [
    AppComponent,
    ConfigComponent,
    DownloaderComponent,
    HeroesComponent,
    PackageSearchComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    ConfigService,
    DownloaderService,
    HeroesService,
    HttpErrorHandler
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
