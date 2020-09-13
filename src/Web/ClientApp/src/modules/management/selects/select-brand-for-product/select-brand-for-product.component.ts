import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Page} from '../../../../models/Page';
import {ActivatedRoute, Router} from '@angular/router';
import {Sort} from '@angular/material/sort';
import {MatSelectionListChange} from '@angular/material/list';
import {Brand} from '../../../../models/Brand';
import {BrandService} from '../../../../services/brand.service';
import {Product} from '../../../../models/product/Product';

@Component({
  selector: 'app-select-brand-for-product',
  templateUrl: './select-brand-for-product.component.html',
  styleUrls: ['./select-brand-for-product.component.scss']
})
export class SelectBrandForProductComponent implements OnInit, AfterViewInit {

  isLoading = false;
  page: Page<Brand>;
  sortTitle = '';
  searchTitle = '';

  @ViewChild('paginator')
  private paginator: MatPaginator;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _brandService: BrandService) {
  }

  private _selected: Brand;

  get selected(): Brand {
    return this._selected;
  }

  private _source: Brand;

  get source(): Brand {
    return this._source;
  }

  @Input()
  set product(product: Product) {
    if (product.brandId) {
      this._brandService.getBrandById(product.brandId)
        .subscribe(brand => {
          this._source = this._selected = brand;
        });
    }
  }

  get isModified(): boolean {
    return this._selected?.id !== this._source?.id;
  }

  get hasSource(): boolean {
    return !!this.source;
  }

  get canBeRestored(): boolean {
    return this.hasSource && this._selected?.id !== this._source.id;
  }

  get hasSelected(): boolean {
    return !!this._selected;
  }

  isSelected(brand: Brand): boolean {
    return this.hasSelected && this._selected.id === brand.id;
  }

  isSource(brand: Brand): boolean {
    return this.hasSource && this._source.id === brand.id;
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
    this._selected = $event.option.value;
  }

  restoreClick() {
    this._selected = this._source;
  }

  emptyClick() {
    this._selected = null;
  }

  private loadPage(page: number): void {
    this.isLoading = true;
    this._brandService.getBrandsPage(page, this.sortTitle, this.searchTitle)
      .subscribe((brandPage: Page<Brand>) => {
        this.page = brandPage;
        this.initPaginator(brandPage);
      }).add(() => this.isLoading = false);
  }

  private initPaginator(page: Page<any>) {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageIndex - 1;
  }
}
