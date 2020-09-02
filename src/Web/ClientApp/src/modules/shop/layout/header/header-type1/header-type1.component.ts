import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, query, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {Catalog} from 'src/models/catalog/Catalog';
import {AppHelpers} from '../../../../../AppHelpers';

@Component({
  selector: 'app-header-type1',
  templateUrl: './header-type1.component.html',
  styleUrls: ['../header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [

    trigger('ddAnimation', [
      transition(':enter', [
        query(':self', style({height: '0'})),
        query('.dropdown-content-inner', style({opacity: 0, visibility: 'hidden'}), {optional: true}),
        query(':self', animate('0.11s', style({height: '*'}))),
        query('.dropdown-content-inner', animate('0.3s', style({opacity: 1, visibility: 'visible'})), {optional: true}),
      ]),
      transition(':leave', [
        query('.dropdown-content-inner', style({opacity: 0}), {optional: true}),
        query(':self', animate('0.11s', style({height: '0'}))),
      ]),
    ]),

    trigger('blinkAnimation', [
      state('void', style({opacity: '0'})),
      state('*', style({opacity: '1'})),
      transition('void => *', [
        animate('0.3s')
      ]),
      transition('* => void', [
        animate('0s')
      ])
    ]),

    trigger('catalogNavAnimation', [
      state('show', style({display: 'block'})),
      state('hide', style({display: 'none'})),
      transition('show => hide', [animate('0s')]),
      transition('hide => show', [animate('1s')]),
    ]),

    trigger('searchAnimation', [
      transition(':enter', [
        style({opacity: 0, width: '1px'}),
        animate('0s', style({width: '*'})),
        animate('0.5s', style({opacity: '1'})),
      ]),
    ]),

  ],
})
export class HeaderType1Component implements OnInit {

  activeMenuItemId: number | string = null;

  searchInput: string;

  catalogs: Catalog[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router) {
    this.catalogs = _route.snapshot.data.navData as Catalog[];
  }

  get someCatalogNavItemIsActive(): boolean {
    return this.sliceRoots(this.catalogs).some(c => c.id === this.activeMenuItemId);
  }

  get searchIsActive(): boolean {
    return this.activeMenuItemId === 'search';
  }

  ngOnInit(): void {
  }

  sliceRoots(catalogs: Catalog[]): Catalog[] {
    return catalogs?.filter(c => !c.parentCatalogId);
  }

  sliceChildsOf(catalogs: Catalog[], root: Catalog): Catalog[] {
    return catalogs.filter(c => root.id === c.parentCatalogId);
  }

  closestEdge(mouse, elem): 'left' | 'right' | 'top' | 'bottom' {
    return AppHelpers.closestEdge(mouse, elem);
  }

  dropDownMouseLeave(event: MouseEvent, element: HTMLElement): void {
    if (this.closestEdge(event, element) !== 'top') {
      this.resetNavDropdown();
    }
  }

  navCatalogMouseEnter(id: number): void {
    this.activeMenuItemId = id;
  }

  navMouseLeave(event: MouseEvent, element: HTMLElement): void {
    if (this.closestEdge(event, element) !== 'bottom' || (this.searchIsActive && !this.searchInput)) {
      this.resetNavDropdown();
    }
  }

  searchFocusIn(): void {
    this.activeMenuItemId = 'search';
  }

  resetNavDropdown(): void {
    this.activeMenuItemId = null;
  }

  navItemIsActive(itemId: number | string): boolean {
    return this.activeMenuItemId === itemId;
  }
}
