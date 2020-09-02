import {Component, Input, OnInit} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {Page} from '../../../../../models/Page';
import {Subject} from 'rxjs';
import {debounceTime, finalize, map, take} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../../services/product.service';
import {BrandService} from '../../../../../services/brand.service';
import {CatalogService} from '../../../../../services/catalog.service';
import {Sort} from '@angular/material/sort';
import {PageEvent} from '@angular/material/paginator';
import {OrderService} from '../../../../../services/order.service';
import {OrderSearchModel} from '../../../../../models/search/OrderSearchModel';
import {AccountService} from '../../../../../services/account.service';
import {OrderOverviewViewModel} from '../../../../../viewModels/OrderOverviewViewModel';
import {AuthorizeService} from '../../../../api-authorization/authorize.service';
import {FormControl} from '@angular/forms';
import {DeliveryStatus} from '../../../../../models/order/Order';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  animations: [
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
            style({
              opacity: 0,
              transform: 'scale(0.95)',
            }),
            stagger(90, [animate('300ms', style({opacity: 1, transform: 'none'}))])
          ], {optional: true}
        )
      ])
    ]),
  ],
})
export class OrdersComponent implements OnInit {

  isLoading = false;
  page: Page<OrderOverviewViewModel>;

  searchFormControl: FormControl = new FormControl({value: '', disabled: false});

  @Input() sortDate = '';
  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  searchModel: OrderSearchModel = new OrderSearchModel();
  tabIndex = 0;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _orderService: OrderService,
    private _accountService: AccountService,
    private _authorizeService: AuthorizeService,
    private _brandService: BrandService,
    private _catalogService: CatalogService) {

    this.searchSubject.subscribe(orderIdValue => {
      this.searchModel.ids = orderIdValue ? [+orderIdValue] : undefined;
      this.loadPage();
    });
    this.searchFormControl.valueChanges.subscribe((value) => {
      if (!isNaN(value) || value === '' || value === undefined || value === null) {
        this.searchSubject.next(value);
      }
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  sortChange(sort: Sort) {
    if (sort.active === 'date') {
      this.sortDate = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageNumber);
    }
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  tabIndexChange(index: number) {
    if (index === 0) {
      this.searchModel.statuses = undefined;
    } else if (index === 1) {
      this.searchModel.statuses = [DeliveryStatus.Delivered];
    } else if (index === 2) {
      this.searchModel.statuses = [DeliveryStatus.InTransit];
    } else if (index === 3) {
      this.searchModel.statuses = [DeliveryStatus.Canceled];
    }
    this.loadPage(index + 1);
  }

  deliveryStatusIcon(status: DeliveryStatus): string {
    switch (status) {
      case DeliveryStatus.Canceled:
        return 'cancel';
      case DeliveryStatus.Delivered:
        return 'assignment_turned_in';
      case DeliveryStatus.InTransit:
        return 'access_time';
      case DeliveryStatus.Statement:
        return 'query_builder';
    }
  }

  deliveryStatusClass(status: DeliveryStatus): string {
    switch (status) {
      case DeliveryStatus.Canceled:
        return 'text-danger';
      case DeliveryStatus.Delivered:
        return 'text-success';
      case DeliveryStatus.InTransit:
        return 'text-warning';
      case DeliveryStatus.Statement:
        return 'text-warning';
    }
  }

  dateFromString(dateString: string): number {
    try {
      return Date.parse(dateString);
    } catch (e) {
      return Date.now();
    }
  }

  private loadPage(pageNumber: number = 1): void {
    this.isLoading = true;
    this._accountService.getOrdersPage(this.page?.pageNumber ?? pageNumber,
      this.sortDate ? new Map<string, string>([['date', this.sortDate]]) : null,
      this.searchModel).pipe(take(1), finalize(() => this.isLoading = false), map(p => {
      const items = p.items.map(item => new OrderOverviewViewModel(
        item.id, item.date, item.comment, item.buyerId, item.addressId, item.status));
      return new Page<OrderOverviewViewModel>(items, p.pageNumber, p.totalPages, p.totalItems, p.hasPreviousPage, p.hasNextPage);
    }))
      .subscribe(page => {
        this.page = page;
        console.log(page);
      });
  }
}
