import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserBasketService} from '../../../services/user-basket.service';
import {defaultIfEmpty, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserBasketCheckoutGuard implements CanActivate {
  constructor(private _userBasketService: UserBasketService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this._userBasketService.basketProducts().pipe(defaultIfEmpty([]), map(a => a?.length > 0));
  }
}
