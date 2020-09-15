import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {AuthorizeService} from '../../../api-authorization/authorize.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActiveBreadcrumbItem, BreadcrumbItem} from '../../shop-core/breadcrumbs/breadcrumbs.component';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss']
})
export class AccountDetailsComponent implements OnInit {

  @Input()
  sidenavMode = 'side';

  constructor(
    private _formBuilder: FormBuilder,
    private _authorizeService: AuthorizeService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _httpClient: HttpClient,
    private _snackBar: MatSnackBar,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      new ActiveBreadcrumbItem('Профиль')
    ];
  }

  ngOnInit() {
  }
}
