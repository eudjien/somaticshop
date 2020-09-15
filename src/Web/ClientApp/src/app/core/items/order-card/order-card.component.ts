import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {OrderOverviewViewModel} from '../../../../viewModels/OrderOverviewViewModel';

@Component({
  selector: 'app-order-card',
  templateUrl: './order-card.component.html',
  styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent implements OnInit {

  @HostBinding('class.mat-elevation-z1')
  matElevation = true;

  @Input()
  order: OrderOverviewViewModel;

  constructor() {
  }

  ngOnInit(): void {
  }
}
