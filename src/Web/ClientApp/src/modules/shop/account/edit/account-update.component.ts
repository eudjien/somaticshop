import {Component, Input, OnInit} from '@angular/core';
import {ActiveBreadcrumbItem, BreadcrumbItem, LinkBreadcrumbItem} from '../../shop-core/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-update-account',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss']
})
export class AccountUpdateComponent implements OnInit {

  @Input()
  sidenavMode = 'side';

  constructor() {
  }

  ngOnInit(): void {
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      new LinkBreadcrumbItem('/', 'Профиль'),
      new ActiveBreadcrumbItem('Редактировать')
    ];
  }
}
