import {Component, OnInit} from '@angular/core';
import {AuthorizeService} from '../../api-authorization/authorize.service';
import {Subscription} from 'rxjs';
import {AccountService} from '../../../services/account.service';
import {MediaObserver} from '@angular/flex-layout';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  mqWatcher: Subscription;
  sidenavMode = 'side';

  constructor(
    private _accountService: AccountService,
    private _authorizeService: AuthorizeService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _mediaObserver: MediaObserver) {

    this.mqWatcher = _mediaObserver.asObservable().subscribe((changes) => {
      if (changes[2].mqAlias === 'lt-md') {
        this.sidenavMode = 'over';
      } else {
        this.sidenavMode = 'side';
      }
    });
  }

  async ngOnInit() {
  }

  private async navigateToRedirectUrl(): Promise<void> {
    const returnUrl = this._route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      const successNavigate = await this._router.navigateByUrl(returnUrl);
      if (!successNavigate) {
        await this._router.navigate(['/']);
      }
    } else {
      await this._router.navigate(['/']);
    }
  }
}
