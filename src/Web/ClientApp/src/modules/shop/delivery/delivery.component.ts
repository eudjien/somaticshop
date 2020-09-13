import {Component, OnInit} from '@angular/core';
import {ActiveBreadcrumbItem, BreadcrumbItem, LinkBreadcrumbItem} from '../shop-core/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-delivery',
  templateUrl: './delivery.component.html',
  styleUrls: ['./delivery.component.scss']
})
export class DeliveryComponent implements OnInit {

  constructor() {
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      new LinkBreadcrumbItem('/', 'Главная'),
      new ActiveBreadcrumbItem('Доставка')
    ];
  }

  ngOnInit(): void {
  }
}
