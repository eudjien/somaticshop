import {Component, OnInit} from '@angular/core';
import {ActiveBreadcrumbItem, BreadcrumbItem, LinkBreadcrumbItem} from '../shop-core/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor() {
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      new LinkBreadcrumbItem('/', 'Главная'),
      new ActiveBreadcrumbItem('О нас')
    ];
  }

  ngOnInit(): void {
  }
}
