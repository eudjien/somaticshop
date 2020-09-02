import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-update-account',
  templateUrl: './account-update.component.html',
  styleUrls: ['./account-update.component.scss']
})
export class AccountUpdateComponent implements OnInit {

  @Input()
  sidenavMode = 'side';

  constructor() {
  }

  ngOnInit(): void {
  }
}
