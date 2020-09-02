import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../../../../../models/User';
import {AccountService} from '../../../../../services/account.service';
import {AuthorizeService} from '../../../../api-authorization/authorize.service';
import {MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.scss']
})
export class PersonalDataComponent implements OnInit {

  user$: Observable<User>;

  constructor(
    private _accountService: AccountService,
    private _authorizeService: AuthorizeService,
    private _mediaObserver: MediaObserver) {
    this.user$ = this._accountService.getUser();
  }

  ngOnInit(): void {
  }
}
