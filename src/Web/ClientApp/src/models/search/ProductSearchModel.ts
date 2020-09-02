import {PriceRange} from '../PriceRange';

export class ProductSearchModel {
  constructor(
    public ids?: number[],
    public titles?: string[],
    public groupIds?: number[],
    public catalogIds?: number[],
    public brandIds?: number[],
    public priceRange?: PriceRange
  ) {
  }
}
