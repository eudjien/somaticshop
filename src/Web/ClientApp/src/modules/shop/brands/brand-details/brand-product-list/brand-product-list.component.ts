import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../../../../../models/Page';
import {ProductCard} from '../../../../../viewModels/ProductCard';
import {ProductService} from '../../../../../services/product.service';
import {BrandService} from '../../../../../services/brand.service';
import {CatalogService} from '../../../../../services/catalog.service';
import {Sort} from '@angular/material/sort';
import {PageEvent} from '@angular/material/paginator';
import {defaultIfEmpty, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {zip} from 'rxjs';
import {ProductSearch} from '../../../../../models/search/ProductSearch';
import {ProductSort} from '../../../../../models/ProductSort';

@Component({
  selector: 'app-brand-product-list',
  templateUrl: './brand-product-list.component.html',
  styleUrls: ['./brand-product-list.component.scss'],
})
export class BrandProductListComponent implements OnInit {

  isEmpty = false;
  isLoading = false;
  page: Page<ProductCard>;
  sort: ProductSort = ProductSort.DateDesc;

  @Input() sortPrice = '';

  brandId: number;

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService) {
  }

  @Input()
  set update(brandId: number) {
    this.brandId = brandId;
    this.loadPage();
  }

  ngOnInit(): void {
  }

  sortChange(sort: Sort) {
    if (sort.active === 'price') {
      this.sortPrice = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageIndex);
    }
  }

  pageChange(pageIndex: number) {
    this.loadPage(pageIndex + 1);
  }

  private loadPage(pageIndex: number = 1): void {
    this.isLoading = true;
    this.loading.emit(true);
    const res = this._productService.getProductsPage(
      pageIndex,
      new ProductSearch(null, null, null, null, [this.brandId]),
      this.sort,
    ).pipe(switchMap(page => {

          const items = page.items.map(item => new ProductCard(item.id, item.name, item.description, item.price, null));

          const obs1 = zip(...items.map(product => {
            return this._productService.getProductOverviewImageUrl(product.id)
              .pipe(tap(imageUrl => product.imageUrl = imageUrl));
          })).pipe(defaultIfEmpty([]));

          return obs1.pipe(mergeAll(), mapTo(new Page<ProductCard>(items,
            page.pageIndex, page.totalPages, page.totalItems, page.hasPreviousPage, page.hasNextPage)));
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
}
