import {Component, OnInit} from '@angular/core';

import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/internal/operators';

import {PackageSearchService, NpmPackageInfo} from './package-search.service';

@Component({
  selector: 'app-package-search',
  providers: [PackageSearchService],
  template: `
    <h3>Search Npm Packages</h3>
    <p><i>Searches when typing stops. Caches for 30 seconds.</i></p>
    <input (keyup)="search($event.target.value)" id="name" placeholder="Search"/>
    <input type="checkbox" id="refresh" [checked]="withRefresh" (click)="toggleRefresh()">
    <label for="refresh">with refresh</label>

    <ul>
      <li *ngFor="let package of packages$ | async">
        <b>{{package.name}} v.{{package.version}}</b> -
        <i>{{package.description}}</i>
      </li>
    </ul>
  `,
  styleUrls: ['./package-search.component.css']
})
export class PackageSearchComponent implements OnInit {
  withRefresh = false;
  packages$: Observable<NpmPackageInfo[]>;
  private searchText$ = new Subject<string>();

  /*The searchText$ is the sequence of search-box values coming from the user. It's defined as an RxJS Subject, which means ,
  it is a multicasting Observable that can also produce values for itself by calling next(value), as happens in the search()
   method.*/
  search(packageName: string) {
    this.searchText$.next(packageName);
  }

  /*Rather than forward every searchText value directly to the injected PackageSearchService,
   the code in ngOnInit() pipes search values through three operators
   The code sets packages$ to this re-composed Observable of search results. The template subscribes to packages$ with,
   the AsyncPipe and displays search results as they arrive.
   A search value reaches the service only if it's a new value and the user has stopped typing.
   The switchMap() operator has three important characteristics.
      -It takes a function argument that returns an Observable. PackageSearchService.search returns an Observable,
      as other data service methods do.
      -If a previous search request is still in-flight (as when the connection is poor), it cancels that request and sends a new one.
      -It returns service responses in their original request order, even if the server returns them out of order.
      If you think you'll reuse this debouncing logic, consider moving it to a utility function or into the PackageSearchService itself.
      */
  ngOnInit() {
    this.packages$ = this.searchText$.pipe(
      debounceTime(500),   //  wait for the user to stop typing (1/2 second in this case).
      distinctUntilChanged(),       //  wait until the search text changes.
      switchMap(packageName =>    //  send the search request to the service.
        this.searchService.search(packageName, this.withRefresh))
    );
  }

  constructor(private searchService: PackageSearchService) {
  }


  toggleRefresh() {
    this.withRefresh = !this.withRefresh;
  }


}
