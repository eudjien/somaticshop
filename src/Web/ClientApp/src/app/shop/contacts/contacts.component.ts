import {Component, OnInit} from '@angular/core';
import {ActiveBreadcrumbItem, BreadcrumbItem, LinkBreadcrumbItem} from '../shop-core/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit {

  constructor() {
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      new LinkBreadcrumbItem('/', 'Главная'),
      new ActiveBreadcrumbItem('Контакты')
    ];
  }

  ngOnInit(): void {
  }
}
