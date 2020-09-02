import {BrandCard} from './BrandCard';

export class ProductCard {
  constructor(
    public id = 0,
    public title?: string,
    public description?: string,
    public price?: number,
    public brand?: BrandCard,
    public imageUrl?: string
  ) {
  }
}
