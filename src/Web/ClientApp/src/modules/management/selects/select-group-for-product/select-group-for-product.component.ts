import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Page} from '../../../../models/Page';
import {ActivatedRoute, Router} from '@angular/router';
import {Sort} from '@angular/material/sort';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {ProductGroup} from '../../../../models/product/ProductGroup';
import {ProductService} from '../../../../services/product.service';
import {Product} from '../../../../models/product/Product';

@Component({
  selector: 'app-select-group-for-product',
  templateUrl: './select-group-for-product.component.html',
  styleUrls: ['./select-group-for-product.component.scss']
})
export class SelectGroupForProductComponent implements OnInit, AfterViewInit {

  isLoading = false;

  @Input()
  source: ProductGroup;
  @Input()
  selected: ProductGroup;

  page: Page<ProductGroup>;

  sortTitle = '';
  searchTitle = '';

  @ViewChild('paginator')
  private paginator: MatPaginator;
  @ViewChild('selectionList')
  private selectionList: MatSelectionList;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService) {
  }

  get isModified(): boolean {
    return this.selected?.id !== this.source?.id;
  }

  get hasSource(): boolean {
    return !!this.source;
  }

  get hasSelected(): boolean {
    return !!this.selected;
  }

  get canBeRestored(): boolean {
    return this.hasSource && this.selected?.id !== this.source.id;
  }

  set product(product: Product) {
    if (product.groupId) {
      const existGroup = this.page?.items.find(a => a.id === product.groupId);
      if (existGroup) {
        this.source = this.selected = existGroup;
      } else {
        this._productService.getProductGroupById(product.groupId)
          .subscribe(group => {
            this.source = this.selected = group;
          });
      }
    }
  }

  isSelected(group: ProductGroup): boolean {
    return this.hasSelected && this.selected.id === group.id;
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  ngAfterViewInit(): void {
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  sortChange(sort: Sort) {
    if (sort.active === 'title') {
      this.sortTitle = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageIndex);
    }
  }

  searchChange($event: string) {
    this.searchTitle = $event;
    this.loadPage(this.page.pageIndex);
  }

  selectionChange($event: MatSelectionListChange) {
    this.selected = $event.option.value;
  }

  restoreClick() {
    this.selected = this.source;
  }

  emptyClick() {
    this.selected = null;
  }

  private loadPage(page: number): void {
    this.isLoading = true;
    this._productService.getProductGroupsPage(page, this.sortTitle, this.searchTitle)
      .subscribe((groupPage: Page<ProductGroup>) => {
        this.page = groupPage;
        this.initPaginator(groupPage);
      }).add(() => this.isLoading = false);
  }

  private initPaginator(page: Page<any>): void {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageIndex - 1;
  }
}
