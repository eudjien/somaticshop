import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as Cookies from 'js-cookie';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {map, mapTo, switchMap, switchMapTo, tap} from 'rxjs/operators';
import {BasketService} from './basket.service';
import {BasketProduct} from '../models/basket/BasketProduct';

@Injectable({
  providedIn: 'root'
})
export class UserBasketService {

  private static readonly BASKET_COOKIE_NAME = 'USER_BASKET';
  private basketProductsSubject: BehaviorSubject<BasketProduct[]> = new BehaviorSubject(null);

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  private static writeCookie(headers: HttpHeaders): void {
    Cookies.set(BasketService.BASKET_COOKIE_NAME, headers.get('USER_BASKET'), {expires: 8});
  }

  public createOrUpdateBasketProduct(productId: number, quantity: number = 1): Observable<BasketProduct> {
    return this._createOrUpdateBasketProduct(productId, quantity).pipe(
      switchMap(response => this._basketProducts()
        .pipe(tap(basketProducts => this.basketProductsSubject.next(basketProducts)), mapTo(response))
      )
    );
  }

  public deleteBasketProduct(productId: number): Observable<HttpResponse<any>> {
    return this._deleteBasketProduct(productId).pipe(
      tap(response => {
        if (response.status >= 200 && response.status <= 299) {
          this.basketProductsSubject.next(this.basketProductsSubject.getValue().filter(p => p.productId !== productId));
        }
      }));
  }

  public basketProducts(): Observable<BasketProduct[]> {
    return this._basketProducts().pipe(tap(basketProducts => this.basketProductsSubject.next(basketProducts)),
      switchMapTo(this.basketProductsSubject.asObservable()));
  }

  public basketProduct(productId: number): Observable<BasketProduct> {
    return this._basketProduct(productId);
  }

  private getApiUrl(): string {
    return `${this.baseUrl}api/userBasket`;
  }

  private _createOrUpdateBasketProduct(productId: number, quantity: number = 1): Observable<BasketProduct> {
    const cookieValue = Cookies.get(BasketService.BASKET_COOKIE_NAME);
    return this.httpClient.put<BasketProduct>(this.getApiUrl() +
      `?productId=${productId ?? ''}` +
      `&quantity=${quantity ?? 1}` +
      `&userOrAnonymousId=${cookieValue ?? ''}`,
      null, {observe: 'response'})
      .pipe(tap(response => UserBasketService.writeCookie(response.headers)), map(response => response.body));
  }

  private _deleteBasketProduct(productId: number): Observable<HttpResponse<any>> {
    const cookieValue = Cookies.get(BasketService.BASKET_COOKIE_NAME);
    return this.httpClient.put<HttpResponse<any>>(this.getApiUrl() +
      `?productId=${productId ?? ''}` +
      `&userOrAnonymousId=${cookieValue ?? ''}`
      , null, {observe: 'response'})
      .pipe(tap(response => UserBasketService.writeCookie(response.headers)));
  }

  private _basketProducts(): Observable<BasketProduct[]> {
    const params = new HttpParams().append('userOrAnonymousId', Cookies.get(BasketService.BASKET_COOKIE_NAME));
    return this.httpClient.get<BasketProduct[]>(`${this.getApiUrl()}/products`, {params: params, observe: 'response'})
      .pipe(tap(response => UserBasketService.writeCookie(response.headers)), map(response => response.body));
  }

  private _basketProduct(productId: number): Observable<BasketProduct> {
    const params = new HttpParams().append('userOrAnonymousId', Cookies.get(BasketService.BASKET_COOKIE_NAME));
    return this.httpClient.get<BasketProduct>(`${this.getApiUrl()}/${productId}`, {params: params, observe: 'response'})
      .pipe(tap(response => UserBasketService.writeCookie(response.headers)), map(response => response.body));
  }
}
