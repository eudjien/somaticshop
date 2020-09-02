import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthorizeService} from '../../../../api-authorization/authorize.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-login-menu',
  templateUrl: './login-menu.component.html',
  styleUrls: ['./login-menu.component.css']
})
export class LoginMenuComponent implements OnInit {

  public isAuthenticated$ = this._authorizeService.isAuthenticated();
  public isAdmin$ = this._authorizeService.isUserInRole('Admin');
  public userName$ = this._authorizeService.getUser().pipe(map(u => u && u.name));

  constructor(
    private _authorizeService: AuthorizeService,
    private _route: ActivatedRoute,
    private _router: Router) {
  }

  get returnParam(): { returnUrl: string } {
    return {returnUrl: this._router.url};
  }

  ngOnInit() {
  }

  logOut() {
    this._authorizeService.signOut({returnUrl: '/'});
  }
}
