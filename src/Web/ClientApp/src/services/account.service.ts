import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {User} from '../models/User';
import {PasswordOptionsModel} from '../models/PasswordOptionsModel';
import {Order} from '../models/order/Order';
import {OrderSearchModel} from '../models/search/OrderSearchModel';
import {Page} from '../models/Page';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  public getUser(): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}api/account`);
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

    console.log(params.getAll('search.id'));

    return this.httpClient.get<Page<Order>>(`${this.baseUrl}api/account/orders`, {params: params});
  }

  public updateFullName(firstName: string = null, lastName: string = null, surName: string = null): Observable<HttpResponse<any>> {
    const body = {firstName: firstName, lastName: lastName, surName: surName};
    return this.httpClient.put<any>(`${this.baseUrl}api/account/fullname`, body);
  }

  public updateEmail(newEmail: string): Observable<HttpResponse<any>> {
    return this.httpClient.put<HttpResponse<any>>(`${this.baseUrl}api/account/email/${newEmail}`, null);
  }

  public updatePhoneNumber(newPhoneNumber: string): Observable<HttpResponse<any>> {
    return this.httpClient.put<HttpResponse<any>>(`${this.baseUrl}api/account/phonenumber/${newPhoneNumber}`, null);
  }

  public updatePassword(currentPassword: string, newPassword: string): Observable<HttpResponse<any>> {
    return this.httpClient.put<HttpResponse<any>>(`${this.baseUrl}api/account/password`,
      {currentPassword: currentPassword, newPassword: newPassword});
  }

  public getPasswordOptions(): Observable<PasswordOptionsModel> {
    return this.httpClient.get<PasswordOptionsModel>(`${this.baseUrl}api/account/password/options`);
  }
}
