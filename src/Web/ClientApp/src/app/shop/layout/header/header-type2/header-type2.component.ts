import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {animate, query, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {Catalog} from 'src/models/catalog/Catalog';
import {AppHelpers} from '../../../../../AppHelpers';

@Component({
  selector: 'app-header-type2',
  templateUrl: './header-type2.component.html',
  styleUrls: ['../header.component.scss', './header-type2.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [

    trigger('ddAnimation', [
      transition(':enter', [
        query(':self', style({height: '0'})),
        query('.dropdown-content-inner', style({opacity: 0, visibility: 'hidden'})),
        query(':self', animate('0.11s', style({height: '*'}))),
        query('.dropdown-content-inner', animate('0.4s', style({opacity: 1, visibility: 'visible'}))),
      ]),
      transition(':leave', [
        query('.dropdown-content-inner', style({opacity: 0})),
        query(':self', animate('0.11s', style({height: '0'}))),
      ]),
    ]),

    trigger('catalogNavAnimation', [
      state('show', style({display: 'block'})),
      state('hide', style({display: 'none'})),
      transition('show => hide', [animate('0s')]),
      transition('hide => show', [animate('1s')]),
    ]),

    trigger('shrinkGrow', [
      state('shrink', style({width: '*'})),
      state('grow', style({width: '100%'})),
      transition('shrink <=> grow', [animate('0.2s')]),
    ]),

    trigger('expandMenuAnimation', [
      state('open', style({height: '*'})),
      state('hide', style({height: '0'})),
      transition('hide <=> open', [animate('0.11s')]),
    ]),

  ],
})
export class HeaderType2Component implements OnInit {

  menuOpened = false;

  activeMenuItemId: number | string = null;

  searchInput: string;

  catalogs: Catalog[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router) {
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

  closestEdge(mouse, elem): 'left' | 'right' | 'top' | 'bottom' {
    return AppHelpers.closestEdge(mouse, elem);
  }

  dropDownMouseLeave(event: MouseEvent, element: HTMLElement, searchInputElem: HTMLInputElement): void {
    if (this.closestEdge(event, element) !== 'top') {
      this.resetNavDropdown(searchInputElem);
    }
  }

  navCatalogMouseEnter(id: number): void {
    this.activeMenuItemId = id;
  }

  navMouseLeave(event: MouseEvent, element: HTMLElement, searchInputElem: HTMLInputElement): void {
    if (this.closestEdge(event, element) !== 'bottom') {
      this.resetNavDropdown(searchInputElem);
    }
  }

  searchFocusIn($event: any): void {
    this.activeMenuItemId = 'search';
  }

  resetNavDropdown(searchInputElem: HTMLInputElement): void {
    this.activeMenuItemId = null;
    // searchInputElem.blur();
  }

  toggleMenu(): void {
    this.menuOpened = !this.menuOpened;
  }

  menuAnimationState(): string {
    return this.menuOpened ? 'open' : 'hide';
  }
}
