import {Component, Input, OnInit} from '@angular/core';
import {ProductCard} from '../../../viewModels/ProductCard';

@Component({
  selector: 'app-product-layout',
  templateUrl: './product-layout.component.html',
  styleUrls: ['./product-layout.component.scss']
})
export class ProductLayoutComponent implements OnInit {

  @Input()
  mode: 'card' | 'list' = 'card';

  @Input()
  cardSize = 5;

  @Input()
  cards: ProductCard[];

  constructor() {

  }

  ngOnInit(): void {
  }

  get isCardMode(): boolean {
    return this.mode === 'card';
  }

  get isListMode(): boolean {
    return this.mode === 'list';
  }
}
