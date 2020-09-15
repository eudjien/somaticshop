import {Component, Input, OnInit} from '@angular/core';
import {ProductCard} from '../../../viewModels/ProductCard';
import {VIEW_CARD_MODE, VIEW_LIST_MODE} from './product-layout-header/layout-mode-header/layout-mode-header.component';

@Component({
  selector: 'app-product-layout',
  templateUrl: './product-layout.component.html',
  styleUrls: ['./product-layout.component.scss']
})
export class ProductLayoutComponent implements OnInit {

  @Input() layoutMode: 'card' | 'list' = VIEW_CARD_MODE;
  @Input() cardSize = 5;
  @Input() items: ProductCard[];

  constructor() {
  }

  get isCardMode(): boolean {
    return this.layoutMode === VIEW_CARD_MODE;
  }

  get isListMode(): boolean {
    return this.layoutMode === VIEW_LIST_MODE;
  }

  ngOnInit(): void {
  }
}
