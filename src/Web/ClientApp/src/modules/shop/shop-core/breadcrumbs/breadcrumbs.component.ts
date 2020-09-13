import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

export abstract class BreadcrumbItem {
  protected constructor(public name?: string, public iconUrl?: string) {
  }
}

export class ActiveBreadcrumbItem extends BreadcrumbItem {
  constructor(public name?: string, public iconUrl?: string) {
    super();
  }
}

export class LinkBreadcrumbItem extends BreadcrumbItem {
  constructor(public url?: string, public name?: string, public iconUrl?: string) {
    super(name, iconUrl);
  }
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  @Input()
  breadcrumbs: BreadcrumbItem[] = [];

  constructor(private _router: Router) {
  }

  ngOnInit(): void {
  }

  getRouteUrl(breadcrumbItem: BreadcrumbItem): string {
    return breadcrumbItem instanceof LinkBreadcrumbItem ? (breadcrumbItem as LinkBreadcrumbItem).url : '';
  }

  isLink(breadcrumbItem: BreadcrumbItem): boolean {
    return breadcrumbItem instanceof LinkBreadcrumbItem;
  }
}
