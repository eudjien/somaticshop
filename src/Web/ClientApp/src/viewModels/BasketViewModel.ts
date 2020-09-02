import {BasketProductViewModel} from './BasketProductViewModel';

export class BasketViewModel {
  constructor(
    public basketId?: number,
    public basketProductViewModels?: BasketProductViewModel[]) {
  }
}
