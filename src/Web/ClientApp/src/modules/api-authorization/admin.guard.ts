import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {from, Observable} from 'rxjs';
import {AuthorizeService} from './authorize.service';
import {map, mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authorizeService: AuthorizeService, private router: Router) {
  }

  canActivate(
    _next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authorizeService.isUserInRole('Admin')
      .pipe(mergeMap(isAdmin => from(this.handle(isAdmin))));
  }

  private async handle(isAdmin: boolean): Promise<boolean> {
    if (isAdmin) {
      return true;
    }
    await this.router.navigate(['/']);
    return false;
  }
}
