import {AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Page} from '../../../../models/Page';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {Sort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {forkJoin, Observable, of, Subject, zip} from 'rxjs';
import {debounceTime, map, mapTo, switchMap, tap} from 'rxjs/operators';
import {OrderService} from '../../../../services/order.service';
import {DeliveryStatus, Order} from '../../../../models/order/Order';
import {OrderSearchModel} from '../../../../models/search/OrderSearchModel';
import {Address} from '../../../../models/Address';
import {Buyer} from '../../../../models/Buyer';
import {AddressService} from '../../../../services/address.service';
import {BuyerService} from '../../../../services/buyer.service';
import {MediaObserver} from '@angular/flex-layout';

class OrderItemViewModel {
  public changedStatus?: DeliveryStatus;

  constructor(
    public id?: number,
    public date?: string,
    public comment?: string,
    public status?: DeliveryStatus,
    public address?: Address,
    public buyer?: Buyer) {
    this.changedStatus = status;
  }
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit, AfterViewInit {

  @ViewChild('paginator')
  paginator: MatPaginator;

  isLoading = false;
  page: Page<OrderItemViewModel>;

  changes: OrderItemViewModel[] = [];

  sortId = '';
  searchId = '';

  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  selection = new SelectionModel<Order>(true, []);

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _orderService: OrderService,
    private _addressService: AddressService,
    private _buyerService: BuyerService,
    public mediaObserver: MediaObserver,
    public _dialog: MatDialog,
    public _snackBar: MatSnackBar) {
    this.searchSubject.subscribe(value => {
      this.searchId = value;
      this.loadPage(this.page.pageNumber);
    });
    mediaObserver.asObservable().subscribe(a => {

    });
  }

  get statuses(): DeliveryStatus[] {
    return [DeliveryStatus.Statement, DeliveryStatus.InTransit, DeliveryStatus.Delivered, DeliveryStatus.Canceled];
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  ngAfterViewInit(): void {
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  sortChange(sort: Sort) {
    if (sort.active === 'id') {
      this.sortId = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageNumber);
    }
  }

  searchChange($event: any) {
    this.searchSubject.next($event);
  }

  getStatus(status: DeliveryStatus): string {
    switch (status) {
      case DeliveryStatus.Statement:
        return 'В обработке';
      case DeliveryStatus.InTransit:
        return 'В пути';
      case DeliveryStatus.Delivered:
        return 'Доставлено';
      case DeliveryStatus.Canceled:
        return 'Отменено';
    }
  }

  selectChange(status: DeliveryStatus, item: OrderItemViewModel): void {

    const changesItemIndex = this.changes.findIndex(a => a.id === item.id);

    if (changesItemIndex > -1) {

      if (status === item.status) {
        this.changes = this.changes.filter(a => a.id !== item.id);
      } else {
        this.changes[changesItemIndex] = Object.assign({}, item);
        this.changes[changesItemIndex].status = status;
      }

    } else if (status !== item.status) {
      const i = this.changes.push(Object.assign({}, item));
      this.changes[i - 1].status = status;
    }
  }

  isChanged(order: OrderItemViewModel): boolean {
    return this.changes.some(a => a.id === order.id);
  }

  changedItem(order: OrderItemViewModel): OrderItemViewModel {
    return this.changes.find(a => a.id === order.id);
  }

  applyChanges(): void {
    this.isLoading = true;
    const orders = this.changes.map(a => new Order(a.id, a.date, a.comment, a.status, a.buyer.id, a.address.id));
    this._orderService.updateOrders(orders).pipe(switchMap(a => this.loadPage(this.page.pageNumber)))
      .subscribe(() => {
        this.changes = [];
        this.successUpdatedSnackbar();
      });
  }

  successUpdatedSnackbar(): void {
    this._snackBar.open('Изменения успешно применены.', null, {duration: 3500});
  }

  private loadPage(page: number): Observable<any> {
    this.isLoading = true;
    const searchModel = new OrderSearchModel();
    searchModel.ids = this.searchId ? [+this.searchId] : null;

    const obs = this._orderService.getOrdersPage(page, this.sortId ? new Map<string, string>([['id', this.sortId]]) : null, searchModel)
      .pipe(switchMap(p => {

        const vmPage = new Page<OrderItemViewModel>([], p.pageNumber, p.totalPages, p.totalItems, p.hasPreviousPage, p.hasNextPage);

        return forkJoin(p.items.map(order => zip(
          of(order),
          this._addressService.getAddressById(order.addressId),
          this._buyerService.getBuyerById(order.buyerId)
        ).pipe(map(([o, a, b]) => new OrderItemViewModel(o.id, o.date, o.comment, o.status, a, b)))))
          .pipe(tap(items => vmPage.items = items), mapTo(vmPage));
      })).pipe(tap(vmPage => {
        this.initPage(vmPage);
        this.isLoading = false;
      }));
    obs.subscribe();
    return obs;
  }

  private initPage(page: Page<any>): void {
    this.page = page;
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageNumber - 1;
  }
}
