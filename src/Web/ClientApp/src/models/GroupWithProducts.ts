import {Observable} from 'rxjs';
import {Product} from './product/Product';
import {ProductGroup} from './product/ProductGroup';

export class GroupWithProducts extends ProductGroup {
  products$: Observable<Product[]>;
}
