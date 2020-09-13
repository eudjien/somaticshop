import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AuthorizeService} from '../../api-authorization/authorize.service';
import {AccountService} from '../../../services/account.service';
import {map, tap} from 'rxjs/operators';
import {MediaObserver} from '@angular/flex-layout';
import {MatSidenav} from '@angular/material/sidenav';
import {from} from 'rxjs';

@Component({
  selector: 'app-layout-management',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterViewInit {

  @ViewChild('sideNav')
  sideNav: MatSidenav;

  user$ = this._authorizeService.getUser();

  sidenavMode$ = this._mediaObserver.asObservable()
    .pipe(map(c => c[2].mqAlias === 'lt-lg' ? 'over' : 'side'));

  constructor(
    private _authorizeService: AuthorizeService,
    private _accountService: AccountService,
    private _mediaObserver: MediaObserver) {
  }

  get toggleIcon(): string {
    return !this.sideNav || this.sideNav.opened ? 'keyboard_arrow_left' : 'keyboard_arrow_right';
  }

  ngOnInit(): void {
    from(this._authorizeService.signIn(null)).subscribe(a => {});
  }

  ngAfterViewInit(): void {
  }
}
