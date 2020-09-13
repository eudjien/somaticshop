import {Component, OnInit} from '@angular/core';
import {OrderService} from '../../../../../services/order.service';
import {ProductService} from '../../../../../services/product.service';
import {forkJoin, Observable, of, zip} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {DeliveryStatus, Order} from '../../../../../models/order/Order';
import {Address} from '../../../../../models/Address';
import {Buyer} from '../../../../../models/Buyer';
import {map, switchMap, tap} from 'rxjs/operators';
import {BuyerService} from '../../../../../services/buyer.service';
import {AddressService} from '../../../../../services/address.service';
import {OrderProduct} from '../../../../../models/order/OrderProduct';
import {Product} from '../../../../../models/product/Product';

export class AddressViewModel {
  constructor(
    public id?: number,
    public country?: string,
    public addressText?: string,
    public postalCode?: string) {
  }
}

class BuyerViewModel {
  constructor(
    public id?: number,
    public lastName?: string,
    public firstName?: string,
    public surName?: string,
    public phoneNumber?: string,
    public email?: string,
    public userOrAnonymousId?: string,
  ) {
  }
}

class OrderedProductViewModel {
  public imageUrl$: Observable<string>;

  constructor(
    public id?: number,
    public name?: string,
    public description?: string,
    public unitPrice?: number,
    public quantity?: number,
    public totalPrice?: number) {
  }
}

class OrderViewModel {
  public orderedProductsViewModel$: Observable<OrderedProductViewModel[]>;
  public buyerViewModel$: Observable<BuyerViewModel>;
  public addressViewModel$: Observable<AddressViewModel>;

  constructor(
    public id?: number,
    public date?: string,
    public comment?: string,
    public status?: DeliveryStatus
  ) {
  }
}

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  notExist = false;
  orderViewModel$: Observable<OrderViewModel>;

  constructor(
    private _orderService: OrderService,
    private _productService: ProductService,
    private _buyerService: BuyerService,
    private _addressService: AddressService,
    private _route: ActivatedRoute,
    private _router: Router) {
  }

  ngOnInit(): void {
    const id = +this._route.snapshot.paramMap.get('id');


    this.orderViewModel$ = this._orderService.getOrderById(id)
      .pipe(
        map(order => {
          if (!order) {
            throw new Error('Order not found.');
          }
          return order;
        }),
        map(order => ({order: order, orderViewModel: this.mapToOrderViewModel(order)})),
        tap(orderData => {

          orderData.orderViewModel.buyerViewModel$ =
            this._buyerService.getBuyerById(orderData.order.buyerId).pipe(map(buyer => this.mapToBuyerViewModel(buyer)));

          orderData.orderViewModel.addressViewModel$ =
            this._addressService.getAddressById(orderData.order.addressId).pipe(map(address => this.mapToAddressViewModel(address)));

          orderData.orderViewModel.orderedProductsViewModel$ = this._orderService.getOrderProducts(orderData.order.id).pipe(
            switchMap(orderProducts =>
              forkJoin(orderProducts.map(op => zip(of(op), this._productService.getProductById(op.productId)).pipe(map(([a, b]) => {
                const vm = this.mapToOrderedProductViewModel(a, b);
                vm.imageUrl$ = this._productService.getProductOverviewImageUrl(a.productId);
                return vm;
              })))))
          );
        }), map(a => a.orderViewModel)
      );
  }

  mapToOrderViewModel(order: Order) {
    return new OrderViewModel(order.id, order.date, order.comment, order.status);
  }

  mapToBuyerViewModel(buyer: Buyer): BuyerViewModel {
    return new BuyerViewModel(buyer.id, buyer.lastName, buyer.firstName, buyer.surName,
      buyer.phoneNumber, buyer.email, buyer.userOrAnonymousId);
  }

  mapToAddressViewModel(address: Address): AddressViewModel {
    return new AddressViewModel(address.id, address.country, address.addressText, address.postalCode);
  }

  mapToOrderedProductViewModel(orderProduct: OrderProduct, product: Product): OrderedProductViewModel {
    return new OrderedProductViewModel(
      orderProduct.productId,
      product.name,
      product.description,
      orderProduct.unitPrice,
      orderProduct.quantity,
      orderProduct.unitPrice * orderProduct.quantity);
  }

  totalSum(orderedProducts: OrderedProductViewModel[]): number {
    return orderedProducts.map(a => a.unitPrice * a.quantity).reduce((a, b) => a + b);
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
}
