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
import {PackageSearchComponent} from './package-search/package-search.component';

// services
import {ConfigService} from './config/config.service';
import {DownloaderService} from './downloader/downloader.service';
import {HeroesService} from './heroes/heroes.service';
import {HttpErrorHandler} from './http-error-handler.service';
import {PackageSearchService} from './package-search/package-search.service';
import {httpInterceptorProviders} from './http-interceptors';
import {AuthService} from './auth.service';
import {MessageService} from './message.service';
import {RequestCache, RequestCacheWithMap} from './request-cache.service';


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
    HttpErrorHandler,
    PackageSearchService,
    httpInterceptorProviders,
    AuthService,
    MessageService,
    {provide: RequestCache, useClass: RequestCacheWithMap},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
