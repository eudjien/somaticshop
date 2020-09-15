import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Catalog} from '../../models/catalog/Catalog';
import {Observable} from 'rxjs';
import {defaultIfEmpty, take} from 'rxjs/operators';
import {CatalogService} from '../../services/catalog.service';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NavigationResolver implements Resolve<Catalog[]> {

  constructor(private _catalogService: CatalogService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Catalog[]> | Promise<Catalog[]> | Catalog[] {
    return this._catalogService.childsFor(null, 3).pipe(take(1), defaultIfEmpty(<Catalog[]>[]));
  }
}
