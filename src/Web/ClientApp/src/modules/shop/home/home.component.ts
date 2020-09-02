import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {CatalogService} from '../../../services/catalog.service';
import {MediaObserver} from '@angular/flex-layout';
import {Catalog} from '../../../models/catalog/Catalog';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {Title} from '@angular/platform-browser';
import {AppHelpers} from '../../../AppHelpers';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('listStagger', [
      transition('* => *', [
        query(':enter', [
            style({opacity: 0}),
            stagger(50, [animate('0.3s', style({opacity: 1}))])
          ], {optional: true}
        ),
      ])
    ]),
  ],
})
export class HomeComponent implements OnInit {

  activeMenuItemId: number = null;

  catalogs: Catalog[];

  sidenavMode$ = this._mediaObserver.asObservable()
    .pipe(map(c => c[2].mqAlias === 'lt-lg' ? 'over' : 'side'));

  constructor(
    private _titleService: Title,
    private _catalogService: CatalogService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _mediaObserver: MediaObserver) {
    _titleService.setTitle('SomaticShop - Главная');
    this.catalogs = _route.snapshot.data.navData as Catalog[];
  }

  ngOnInit(): void {
  }

  sliceRoots(catalogs: Catalog[]): Catalog[] {
    return catalogs?.filter(c => !c.parentCatalogId);
  }

  sliceChildsOf(catalogs: Catalog[], root: Catalog): Catalog[] {
    return catalogs.filter(c => root.id === c.parentCatalogId);
  }

  catalogListItemMouseEnter(event: MouseEvent, id: number) {
    this.activeMenuItemId = id;
  }

  catalogListMouseLeave(event: MouseEvent, elem: HTMLElement) {
    if (this.closestEdge(event, elem) !== 'right') {
      this.activeMenuItemId = null;
    }
  }

  dropDownMouseLeave(event: MouseEvent, elem: HTMLElement) {
    if (this.closestEdge(event, elem) !== 'left') {
      this.activeMenuItemId = null;
    }
  }

  closestEdge(mouse, elem): 'left' | 'right' | 'top' | 'bottom' {
    return AppHelpers.closestEdge(mouse, elem);
  }
}
