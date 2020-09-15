import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Page} from '../../../../../models/Page';
import {ProductCard} from '../../../../../viewModels/ProductCard';
import {ProductService} from '../../../../../services/product.service';
import {BrandService} from '../../../../../services/brand.service';
import {CatalogService} from '../../../../../services/catalog.service';
import {defaultIfEmpty, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {zip} from 'rxjs';
import {ProductSearch} from '../../../../../models/search/ProductSearch';
import {ProductSort} from '../../../../../models/sort/ProductSort';

@Component({
  selector: 'app-brand-product-list',
  templateUrl: './brand-product-list.component.html',
  styleUrls: ['./brand-product-list.component.scss'],
})
export class BrandProductListComponent implements OnInit {

  pageIndex: number;
  pageSize = 10;
  sort: ProductSort = ProductSort.DateDesc;

  cardSize = 5;

  isLoading = false;
  page: Page<ProductCard>;

  @Input() sortPrice = '';

  brandId: number;

  sorts: ProductSort[] = [ProductSort.DateDesc, ProductSort.PriceAsc, ProductSort.PriceDesc, ProductSort.OrdersDesc];

  @Output()
  loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  layoutMode: 'card' | 'list' = 'card';

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

  sortChange(sort: ProductSort) {
    this.sort = sort;
    this.loadPage(this.pageIndex);
  }

  pageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.loadPage(this.pageIndex);
  }

  pageChange(pageIndex: number) {
    this.loadPage(pageIndex);
  }

  private loadPage(pageIndex: number = 0): void {
    this.isLoading = true;
    this.loading.emit(true);

    const res = this._productService.productsPage(
      pageIndex,
      new ProductSearch(null, null, null, null, null, [this.brandId]),
      this.sort,
      this.pageSize
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
