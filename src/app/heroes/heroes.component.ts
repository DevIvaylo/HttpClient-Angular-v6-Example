import {Component, OnInit} from '@angular/core';
import {HeroesService, Hero} from './heroes.service';

@Component({
  selector: 'app-heroes',
  providers: [HeroesService],
  template: `
    <h3>Heroes</h3>
    <div>
      <label>Hero name:
        <input #heroName />
      </label>
      <!-- (click) passes input value to add() and then clears the input -->
      <button (click)="add(heroName.value); heroName.value=''">
        add
      </button>
      <button (click)="search(heroName.value)">
        search
      </button>
    </div>

    <ul class="heroes">
      <li *ngFor="let hero of heroes">
        <a (click)="edit(hero)">
          <span class="badge">{{ hero.id || -1 }}</span>
          <span *ngIf="hero!==editHero">{{hero.name}}</span>
          <input *ngIf="hero===editHero"  [(ngModel)]="hero.name"
                 (blur)="update()" (keyup.enter)="update()">
        </a>
        <button class="delete" title="delete hero"
                (click)="delete(hero)">x
        </button>
      </li>
    </ul>
  `,
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  editHero: Hero;  // the hero currently being edited

  constructor(private heroesService: HeroesService) {
  }

  ngOnInit() {
    this.getHeroes();
  }

  // The HeroesComponent initiates the actual GET operation by subscribing to the Observable returned by HeroesService method.
  getHeroes(): void {
    this.heroesService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }


  // The HeroesComponent initiates the actual POST operation by subscribing to the Observable returned by HeroesService method.
  add(name: string): void {
    this.editHero = undefined;
    name = name.trim();
    if (!name) {
      return;
    }

    // the server will generate the id for this new hero
    const newHero: Hero = {name} as Hero;
    this.heroesService.addHero(newHero)
      .subscribe(hero => this.heroes.push(hero));
  }

  /*The HeroesComponent initiates the actual DELETE operation by subscribing to the Observable returned by this service method.
   The component isn't expecting a result from the delete operation, so it subscribes without a callback. Even though,
   you are not using the result, you still have to subscribe. Calling the subscribe() method executes the observable,
   which is what initiates the DELETE request. You must call subscribe() or nothing happens --> this is true for all HttpClient methods.
  */
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroesService.deleteHero(hero.id).subscribe();
  }

  edit(hero) {
    this.editHero = hero;
  }

  search(searchTerm: string) {
    this.editHero = undefined;
    if (searchTerm) {
      this.heroesService.searchHeroes(searchTerm)
        .subscribe(heroes => this.heroes = heroes);
    }
  }

  /*The HeroesComponent initiates the actual UPDATE operation by subscribing to the Observable returned by this service method.*/
  update() {
    if (this.editHero) {
      this.heroesService.updateHero(this.editHero)
        .subscribe(hero => {
          // replace the hero in the heroes list with update from server
          const ix = hero ? this.heroes.findIndex(h => h.id === hero.id) : -1;
          if (ix > -1) {
            this.heroes[ix] = hero;
          }
        });
      this.editHero = undefined;
    }
  }
}
