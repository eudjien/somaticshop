import {Component, Input, OnInit} from '@angular/core';
import {ProductCard} from '../../../../../viewModels/ProductCard';
import {AppConstants} from '../../../../../app-constants';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss']
})
export class ProductListItemComponent implements OnInit {

  @Input()
  card: ProductCard;

  constructor() {
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
  }
}
