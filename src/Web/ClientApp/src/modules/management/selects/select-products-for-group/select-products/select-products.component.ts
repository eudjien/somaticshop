import {AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {Page} from '../../../../../models/Page';
import {Product} from '../../../../../models/product/Product';
import {SelectionModel} from '@angular/cdk/collections';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../../services/product.service';
import {Sort} from '@angular/material/sort';
import {MatCheckboxChange} from '@angular/material/checkbox';
import {ProductGroup} from '../../../../../models/product/ProductGroup';
import {ProductSearchModel} from '../../../../../models/search/ProductSearchModel';

@Component({
  selector: 'app-select-products',
  templateUrl: './select-products.component.html',
  styleUrls: ['./select-products.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectProductsComponent implements OnInit, AfterViewInit {

  isLoading = false;

  @Input()
  productGroup: ProductGroup;

  @Input()
  searchTitle: string;
  @Input()
  sortTitle = null;
  page: Page<Product>;
  selection: SelectionModel<Product> = new SelectionModel<Product>(true, []);
  @Output()
  select: EventEmitter<SelectionModel<Product>> = new EventEmitter<SelectionModel<Product>>();

  onlyUnlocked = false;
  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild('selectionList')
  private selectionList: MatSelectionList;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService) {
  }

  get isAllSelectedInPage(): boolean {
    return this.page && this.page.items.every(a => this.selection.selected.some(b => b.id === a.id));
  }

  get someSelectedInPage(): boolean {
    return this.page && this.page.items.some(a => this.selection.selected.some(b => b.id === a.id))
      && !this.isAllSelectedInPage;
  }

  get isAllLockedInPage(): boolean {
    return this.page && this.page.items.every(a => this.isLocked(a));
  }

  get selectedInPageItems(): Product[] {
    return this.selection.selected.filter(a => this.page.items.some(b => b.id === a.id));
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  init(productGroup?: ProductGroup): void {
    if (productGroup) {

      const searchModel = new ProductSearchModel();
      searchModel.groupIds = [productGroup.id];

      this._productService.getProducts(searchModel)
        .subscribe(products => {
          this.productGroup = productGroup;
          this.selection.clear();
          this.selection.select(...products);
          this.select.emit(this.selection);
          this.loadPage(1);
        });
    } else {
      this.loadPage(1);
    }
  }

  sortChange(sort: Sort): void {
    if (sort.active === 'title') {
      this.sortTitle = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageNumber);
    }
  }

  selectionChange($event: MatSelectionListChange): void {
    if ($event.option.selected) {
      this.selection.select(...[$event.option.value]);
    } else {
      const val = this.selection.selected.find(p => p.id === $event.option.value.id);
      this.selection.deselect(...[val]);
    }
    this.select.emit(this.selection);
  }

  allCheckInPageChange($event: MatCheckboxChange): void {
    if ($event.checked) {
      if (this.someSelectedInPage) {
        this.selection.deselect(...this.selectedInPageItems);
        $event.source.checked = false;
      } else {
        const toSelect = this.page.items.filter(a => this.allowedToSelect(a));
        this.selection.select(...toSelect);
      }
    } else {
      this.selection.deselect(...this.selectedInPageItems);
    }
    this.select.emit(this.selection);
  }

  loadPage(page: number): void {
    this.isLoading = true;

    const searchModel = new ProductSearchModel();
    searchModel.titles = this.searchTitle ? [this.searchTitle] : null;
    searchModel.groupIds = this.onlyUnlocked ? (this.productGroup ? [this.productGroup.id, null] : [null]) : null;

    this._productService.getProductsPage(
      page,
      this.sortTitle,
      searchModel,
    ).subscribe(productPage => {
      this.page = productPage;
      this.initPaginator(productPage);
    }).add(() => this.isLoading = false);
  }

  paginationChange($event: PageEvent): void {
    this.loadPage($event.pageIndex + 1);
  }

  onDeleted($remainingProducts: Product[]): void {
    this.selection.deselect(...this.selection.selected.filter(b => !$remainingProducts.some(c => c.id === b.id)));
  }

  isSelected(product: Product): boolean {
    return this.selection.selected.some(a => a.id === product.id);
  }

  isLocked(item: Product): boolean {
    if (item.groupId === this.productGroup?.id) {
      return false;
    } else if (item.groupId) {
      return true;
    }
    return false;
  }

  allowedToSelect(item: Product): boolean {
    if (this.selection.selected.some(a => a.id === item.id)) {
      return false;
    }
    return !this.isLocked(item);
  }

  lockedItems(): Product[] {
    return this.page.items.filter(a => this.isLocked(a));
  }

  allowedToSelectItems(): Product[] {
    return this.page.items.filter(a => this.allowedToSelect(a));
  }

  onlyUnlockedChange($event: boolean) {
    this.onlyUnlocked = $event;
    this.loadPage(this.page.pageNumber);
  }

  private initPaginator(page: Page<any>): void {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageNumber - 1;
    this.paginator.disabled = false;
  }
}
