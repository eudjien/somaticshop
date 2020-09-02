import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {ProductCard} from '../../../../../viewModels/ProductCard';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss']
})
export class ProductListItemComponent implements OnInit {

  @HostBinding('class.mat-elevation-z1')
  matElevation = true;

  @Input()
  card: ProductCard;

  constructor() {
  }

  ngOnInit(): void {
  }

}
