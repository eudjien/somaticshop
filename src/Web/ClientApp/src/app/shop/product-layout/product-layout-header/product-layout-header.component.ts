import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Page} from '../../../../models/Page';

@Component({
  selector: 'app-product-layout-header',
  templateUrl: './product-layout-header.component.html',
  styleUrls: ['./product-layout-header.component.scss']
})
export class ProductLayoutHeaderComponent implements OnInit {

  static readonly VIEW_LIST_MODE = 'list';
  static readonly VIEW_CARD_MODE = 'card';

  static readonly VIEW_LIST_MODE_ICON: string = 'view_list';
  static readonly VIEW_CARD_MODE_ICON: string = 'view_module';

  @Input()
  layoutMode: 'list' | 'card' = ProductLayoutHeaderComponent.VIEW_LIST_MODE;

  @Output() sortChange: EventEmitter<'priceAsc' | 'priceDesc' | 'dateDesc' | 'ordersDesc' | null>
    = new EventEmitter<'priceAsc' | 'priceDesc' | 'dateDesc' | 'ordersDesc' | null>();
  @Output() layoutModeChange: EventEmitter<'card' | 'list'>
    = new EventEmitter<'card' | 'list'>();
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() page: Page<any>;

  constructor() {
  }

  ngOnInit(): void {
  }

  pageChangeEvent(pageIndex: number): void {
    this.pageChange.emit(pageIndex);
  }

  layoutModeChangeEvent(layoutMode: 'list' | 'card') {
    this.layoutModeChange.emit(this.layoutMode = layoutMode);
  }

  sortChangeEvent(sort: 'priceAsc' | 'priceDesc' | 'dateDesc' | 'ordersDesc' | null) {
    this.sortChange.emit(sort);
  }
}
