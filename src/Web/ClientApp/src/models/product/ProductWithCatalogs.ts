import {Catalog} from '../catalog/Catalog';
import {Observable} from 'rxjs';
import {Product} from './Product';

export class ProductWithCatalogs extends Product {
  catalogs$: Observable<Catalog[]>;
  catalogs: Catalog[];
}
