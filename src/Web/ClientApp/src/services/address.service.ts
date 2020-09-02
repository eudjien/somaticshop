import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Address} from '../models/Address';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  public getAddressById(addressId: number): Observable<Address> {
    if (!addressId) {
      return of(null);
    }
    return this.httpClient.get<Address>(`${this.baseUrl}api/addresses/${addressId}`);
  }
}
