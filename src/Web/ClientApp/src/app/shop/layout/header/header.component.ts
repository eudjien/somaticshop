import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Catalog} from '../../../../models/catalog/Catalog';
import {MediaObserver} from '@angular/flex-layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  @HostBinding('class.header')
  hostClass = true;

  gtSm$ = this._mediaObserver.asObservable().pipe(map(a => a[3].mqAlias === 'gt-sm'));

  activeMenuItemId: number | string = null;

  searchInput: string;

  catalogs: Catalog[];

  constructor(
    private _mediaObserver: MediaObserver,
    private _route: ActivatedRoute,
    private _router: Router) {

  }

  ngOnInit(): void {
  }
}
