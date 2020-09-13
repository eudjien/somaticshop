import {Observable} from 'rxjs';

export class BasketProductViewModel {
  constructor(
    public id?: number,
    public name?: string,
    public imageUrl$?: Observable<string>,
    public quantity?: number,
    public unitPrice?: number,
    public totalPrice?: number,
    public description?: string) {
  }
}
