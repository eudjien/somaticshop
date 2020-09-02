import { Component, OnInit } from '@angular/core';
import {AuthorizeService} from '../../../../api-authorization/authorize.service';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.scss']
})
export class LoginMenuComponent implements OnInit {
  public userName$: Observable<string>;
  public isAuthenticated$: Observable<boolean>;

  constructor(
    private _authorizeService: AuthorizeService,
    private _route: ActivatedRoute,
    private _router: Router) {
  }

  get returnParam(): { returnUrl: string } {
    return {returnUrl: this._router.url};
  }

  ngOnInit() {
    this.isAuthenticated$ = this._authorizeService.isAuthenticated();
    this.userName$ = this._authorizeService.getUser().pipe(map(u => u && u.name));
  }

  logOut() {
    this._authorizeService.signOut({returnUrl: '/'});
  }
}
