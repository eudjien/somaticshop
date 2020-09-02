import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Page} from '../models/Page';
import {Buyer} from '../models/Buyer';
import {BuyerSearchModel} from '../models/search/BuyerSearchModel';

@Injectable({
  providedIn: 'root'
})
export class BuyerService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  public getBuyerById(buyerId: number): Observable<Buyer> {
    if (!buyerId) {
      return of(null);
    }
    return this.httpClient.get<Buyer>(`${this.baseUrl}api/buyers/${buyerId}`);
  }

  public getBuyersPage(
    page: number,
    sort?: Map<string, string>,
    searchModel?: BuyerSearchModel): Observable<Page<Buyer>> {

    let params = new HttpParams();
    params = params.set('page', String(page));

    if (sort) {
      sort.forEach((value, key) => {
        params = params.append(`sort.${key}`, value);
      });
    }

    if (searchModel) {
      searchModel.ids?.forEach(id => params = params.append('search.id', String(id)));
      searchModel.firstNames?.forEach(firstName => params = params.append('search.firstName', firstName ?? ''));
      searchModel.lastNames?.forEach(lastName => params = params.append('search.lastName', lastName ?? ''));
      searchModel.surNames?.forEach(surName => params = params.append('search.surName', surName ?? ''));
      searchModel.phoneNumbers.forEach(phoneNumber => params = params.append('search.phoneNumber', phoneNumber ?? ''));
      searchModel.emails?.forEach(email => params = params.append('search.email', email ?? ''));
      searchModel.userOrAnonymousIds.forEach(uoaId => params = params.append('search.userOrAnonymousId', uoaId ?? ''));
    }

    return this.httpClient.get<Page<Buyer>>(`${this.baseUrl}api/buyers`, {params: params});
  }

}
