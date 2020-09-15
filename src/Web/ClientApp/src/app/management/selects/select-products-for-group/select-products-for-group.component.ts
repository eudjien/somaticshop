import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../services/product.service';
import {MatTabGroup} from '@angular/material/tabs';
import {SelectProductsComponent} from './select-products/select-products.component';
import {SelectToDeleteProductsComponent} from './select-to-delete-products/select-to-delete-products.component';
import {SelectionModel} from '@angular/cdk/collections';
import {ProductGroup} from '../../../../models/product/ProductGroup';
import {Product} from '../../../../models/product/Product';

@Component({
  selector: 'app-list-select-products',
  templateUrl: './select-products-for-group.component.html',
  styleUrls: ['./select-products-for-group.component.scss'],
})
export class SelectProductsForGroupComponent implements OnInit, AfterViewInit {

  isLoading = false;
  @ViewChild('selects')
  selectsComponent: SelectProductsComponent;
  @ViewChild('delSelects')
  selectsToDeleteComponent: SelectToDeleteProductsComponent;
  searchTitle = '';
  isInited = false;
  @ViewChild('tabs')
  private tabsComponent: MatTabGroup;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService) {
  }

  get selectedItems(): Product[] {
    return this.selectsComponent.selection.selected;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  init(productGroup?: ProductGroup): void {
    this.isInited = true;
    this.selectsComponent.init(productGroup);
  }

  searchChange($event: any) {
    const value: string = $event;
    switch (this.tabsComponent.selectedIndex) {
      case 0:
        this.selectsComponent.searchTitle = value;
        this.selectsComponent.loadPage(1);
        break;
      case 1:
        this.selectsToDeleteComponent.searchTitle = value;
        this.selectsToDeleteComponent.loadPage();
        break;
    }
  }

  tabChanged($index: number) {
    switch ($index) {
      case 0: {
        this.searchTitle = this.selectsComponent.searchTitle;
        break;
      }
      case 1: {
        this.searchTitle = this.selectsToDeleteComponent.searchTitle;
        this.selectsToDeleteComponent.loadPage();
        break;
      }
    }
  }

  selectChange($event: SelectionModel<Product>) {
    this.selectsToDeleteComponent.products = [...$event.selected];
  }
}
