import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {ProductSort} from '../../../../../models/ProductSort';

@Component({
  selector: 'app-layout-sort-header',
  templateUrl: './layout-sort-header.component.html',
  styleUrls: ['./layout-sort-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LayoutSortHeaderComponent implements OnInit {

  @Input()
  availableSorts = Object.values(ProductSort).filter(a => typeof a !== 'string').map(k => ProductSort[k] as ProductSort);

  @Input()
  sort: ProductSort;

  @HostBinding('class.layout-sort-header')
  hostClass = true;

  @HostBinding('attr.productLayoutHeaderItem')
  productLayoutHeaderItem = true;

  @Output()
  sortChange: EventEmitter<ProductSort> = new EventEmitter<ProductSort>();

  constructor() {
  }

  ngOnInit(): void {
  }

  sortName(sort: ProductSort): string {
    switch (sort) {
      case ProductSort.DateAsc:
        return 'Сначала старые';
      case ProductSort.DateDesc:
        return 'Сначала новые';
      case ProductSort.OrdersAsc:
        return 'Сначала не популярные';
      case ProductSort.OrdersDesc:
        return 'Сначала популярные';
      case ProductSort.PriceAsc:
        return 'Сначала дешевые';
      case ProductSort.PriceDesc:
        return 'Сначала дорогие';
    }
  }

  sortChangeEvent(sort: ProductSort) {
    this.sortChange.emit(this.sort = sort);
  }

  isActive(sort: ProductSort) {
    return this.sort === sort;
  }
}
