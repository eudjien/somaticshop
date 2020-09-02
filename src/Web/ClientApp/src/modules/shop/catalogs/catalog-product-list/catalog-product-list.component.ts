import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../../services/product.service';
import {BrandService} from '../../../../services/brand.service';
import {CatalogService} from '../../../../services/catalog.service';
import {Page} from '../../../../models/Page';
import {ProductCard} from '../../../../viewModels/ProductCard';
import {zip} from 'rxjs';
import {defaultIfEmpty, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {BrandDetailsViewModel} from '../../../../viewModels/BrandDetailsViewModel';
import {Sort} from '@angular/material/sort';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {CatalogProductsFilter} from '../CatalogProductsFilter';

@Component({
  selector: 'app-catalog-product-list',
  templateUrl: './catalog-product-list.component.html',
  styleUrls: ['./catalog-product-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
            style({
              opacity: 0,
              transform: 'scale(0.95)',
            }),
            stagger(90, [animate('300ms', style({opacity: 1, transform: 'none'}))])
          ], {optional: true}
        )
      ])
    ]),
  ],
})
export class CatalogProductListComponent implements OnInit {

  static readonly VIEW_LIST_MODE_ICON: string = 'view_list';
  static readonly VIEW_CARD_MODE_ICON: string = 'view_module';

  isEmpty = false;

  viewMode: 'card' | 'list' = 'list';

  @Input()
  isLoading = false;
  page: Page<ProductCard>;
  @Input() sortPrice = '';

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  filter: CatalogProductsFilter;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService) {
  }

  @Input()
  set update(filter: CatalogProductsFilter) {
    this.filter = filter;
    this.isEmpty = !filter;
    if (!filter) {
      this.page = null;
    } else {
      this.loadPage();
    }
  }

  ngOnInit(): void {
  }

  enableCardViewMode(): void {
    this.viewMode = 'card';
  }

  enableListViewMode(): void {
    this.viewMode = 'list';
  }

  get viewIcon(): string {
    switch (this.viewMode) {
      case 'card':
        return CatalogProductListComponent.VIEW_CARD_MODE_ICON;
      case 'list':
        return CatalogProductListComponent.VIEW_LIST_MODE_ICON;
      default:
        return CatalogProductListComponent.VIEW_LIST_MODE_ICON;
    }
  }

  sortChange(sort: Sort) {
    if (sort.active === 'price') {
      this.sortPrice = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageNumber);
    }
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  paginationChange2(pageIndex: number) {
    this.loadPage(pageIndex + 1);
  }

  private loadPage(pageNumber: number = 1): void {
    this.isLoading = true;
    this.loading.emit(true);
    const res = this._catalogService.getCatalogProductsPage(
      this.filter.catalogId,
      pageNumber,
      this.filter.priceRange,
      this.filter.brandIds,
      this.sortPrice ? new Map<string, string>([['price', this.sortPrice]]) : null,
      this.filter.specifications)
      .pipe(switchMap(page => {

          const items = page.items.map(item => new ProductCard(item.id, item.title, item.description, item.price,
            new BrandDetailsViewModel(item.brandId)));

          const obs1 = zip(...items.map(product => {
            return this._productService.getProductOverviewImageUrl(product.id)
              .pipe(tap(imageUrl => product.imageUrl = imageUrl));
          })).pipe(defaultIfEmpty([]));

          const obs2 = zip(...items.map(product =>
            zip(this._brandService.getBrandById(product.brand.id), this._brandService.getBrandImageUrl(product.brand.id))
              .pipe(tap(([brand, imageUrl]) => {
                product.brand = brand;
                product.brand.imageUrl = imageUrl;
              })))).pipe(defaultIfEmpty([]));

          return zip(obs1, obs2).pipe(mergeAll(), mapTo(new Page<ProductCard>(items,
            page.pageNumber, page.totalPages, page.totalItems, page.hasPreviousPage, page.hasNextPage)));
        })
      );
    res.subscribe(page => {
      this.page = page;
    }, err => {

    }).add(() => {
      this.loading.emit(false);
      this.isLoading = false;
    });
  }

  get pages(): number[] {
    return Array<number>(this.page.totalPages).fill(0).map((a, i) => i + 1);
  }

  isActivePage(pageNumber: number): boolean {
    return this.page.pageNumber === pageNumber;
  }

  get firstPageIsActive(): boolean {
    return this.page.pageNumber === 1;
  }

  get lastPageIsActive(): boolean {
    return this.page.pageNumber === this.page.totalPages;
  }

  get viewCardIcon(): string {
    return CatalogProductListComponent.VIEW_CARD_MODE_ICON;
  }

  get viewListIcon(): string {
    return CatalogProductListComponent.VIEW_LIST_MODE_ICON;
  }

  get cardModeEnabled(): boolean {
    return this.viewMode === 'card';
  }

  get listModeEnabled(): boolean {
    return this.viewMode === 'list';
  }
}
