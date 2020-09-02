import {Component, OnInit} from '@angular/core';
import {tap} from 'rxjs/operators';
import {AuthorizeService} from '../../../api-authorization/authorize.service';
import {AccountService} from '../../../../services/account.service';
import {MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {


  constructor() {
  }

  ngOnInit(): void {
  }

}
