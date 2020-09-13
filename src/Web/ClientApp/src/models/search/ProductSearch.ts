import {PriceRange} from '../PriceRange';

export class ProductSearch {
  constructor(
    public ids?: number[],
    public titles?: string[],
    public priceRange?: PriceRange,
    public groupIds?: number[],
    public catalogIds?: number[],
    public brandIds?: number[],
    public specifications?: { nameId: number, value: string }[],
  ) {
  }
}
