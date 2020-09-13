import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OrderSearchModel} from '../models/search/OrderSearchModel';
import {Order} from '../models/order/Order';
import {Page} from '../models/Page';
import {Buyer} from '../models/Buyer';
import {Address} from '../models/Address';
import {serialize} from 'object-to-formdata';
import {OrderProduct} from '../models/order/OrderProduct';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  public getOrderById(id: number): Observable<Order> {
    return this.httpClient.get<Order>(`${this.baseUrl}api/orders/${id}`);
  }

  public getOrdersPage(
    page: number,
    sort?: Map<string, string>,
    searchModel?: OrderSearchModel): Observable<Page<Order>> {

    let params = new HttpParams();
    params = params.set('page', String(page));

    if (sort) {
      sort.forEach((value, key) => {
        params = params.append(`sort.${key}`, value);
      });
    }

    if (searchModel) {
      searchModel.ids?.forEach(id => params = params.append('search.id', String(id) ?? ''));
      searchModel.comments?.forEach(comment => params = params.append('search.comment', comment ?? ''));
      searchModel.statuses?.forEach(status => params = params.append('search.status', String(<number>status) ?? ''));
      searchModel.buyerIds?.forEach(buyerId => params = params.append('search.buyerId', String(buyerId) ?? ''));
      searchModel.addressIds?.forEach(addressId => params = params.append('search.addressId', String(addressId) ?? ''));
    }

    return this.httpClient.get<Page<Order>>(`${this.baseUrl}api/orders`, {params: params});
  }

  public createOrder(buyer: Buyer, address: Address, comment: string): Observable<Order> {
    const formData = new FormData();
    serialize(buyer, null, formData, 'buyer');
    serialize(address, null, formData, 'address');
    formData.append('comment', comment);
    return this.httpClient.post<Order>(`${this.baseUrl}api/orders`, formData);
  }

  public getOrderProducts(orderId: number): Observable<OrderProduct[]> {
    return this.httpClient.get<OrderProduct[]>(`${this.baseUrl}api/orders/${orderId}/products`);
  }

  public updateOrders(orders: Order[]): Observable<Order[]> {
    return this.httpClient.put<Order[]>(`${this.baseUrl}api/orders`, orders);
  }
}
