import {ProductSpec} from '../models/product/ProductSpec';
import {BrandDetailsViewModel} from './BrandDetailsViewModel';
import {ProductCard} from './ProductCard';
import {CatalogCard} from './CatalogCard';

export class ProductDetailsViewModel {
  constructor(
    public id = 0,
    public title?: string,
    public content?: string,
    public description?: string,
    public price?: number,
    public catalogs?: CatalogCard[],
    public brand?: BrandDetailsViewModel,
    public imagesUrls?: string[],
    public productsInGroup?: ProductCard[],
    public specifications?: ProductSpec[],
  ) {
  }
}
