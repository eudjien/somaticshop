import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  static readonly BASKET_COOKIE_NAME = 'USER_BASKET';

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }
}
