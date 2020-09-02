import {Catalog} from './Catalog';
import {Observable} from 'rxjs';

export class CatalogWithParents extends Catalog {
  parents$: Observable<Catalog[]>;
  parents: Catalog[];
}
