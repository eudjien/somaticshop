import {PriceRange} from '../../../models/PriceRange';

export class CatalogProductsFilter {
  constructor(
    public catalogId: number,
    public priceRange?: PriceRange,
    public brandIds?: number[],
    public specifications?: Map<string, string[]>
  ) {
  }
}
