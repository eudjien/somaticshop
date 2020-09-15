import {ProductDetailsViewModel} from './ProductDetailsViewModel';

export class BrandDetailsViewModel {
  constructor(
    public id?: number,
    public name?: string,
    public content?: string,
    public imageUrl?: string,
    public products?: ProductDetailsViewModel) {
  }
}
