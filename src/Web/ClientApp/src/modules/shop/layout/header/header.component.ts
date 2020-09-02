import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Catalog} from '../../../../models/catalog/Catalog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit {

  activeMenuItemId: number | string = null;

  searchInput: string;

  catalogs: Catalog[];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router) {

  }

  ngOnInit(): void {
  }
}
