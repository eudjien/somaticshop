import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {Page} from '../../../../../models/Page';
import {ProductCard} from '../../../../../viewModels/ProductCard';
import {ProductService} from '../../../../../services/product.service';
import {BrandService} from '../../../../../services/brand.service';
import {CatalogService} from '../../../../../services/catalog.service';
import {Sort} from '@angular/material/sort';
import {PageEvent} from '@angular/material/paginator';
import {defaultIfEmpty, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {BrandDetailsViewModel} from '../../../../../viewModels/BrandDetailsViewModel';
import {forkJoin, zip} from 'rxjs';
import {ProductSearchModel} from '../../../../../models/search/ProductSearchModel';

@Component({
  selector: 'app-brand-product-list',
  templateUrl: './brand-product-list.component.html',
  styleUrls: ['./brand-product-list.component.scss'],
})
export class BrandProductListComponent implements OnInit {

  isEmpty = false;
  isLoading = false;
  page: Page<ProductCard>;
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
      this.loadPage(this.page.pageNumber);
    }
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  private loadPage(pageNumber: number = 1): void {
    console.log('----' + this.brandId);
    this.isLoading = true;
    this.loading.emit(true);
    const res = this._productService.getProductsPage(
      pageNumber,
      this.sortPrice ? new Map<string, string>([['price', this.sortPrice]]) : null,
      new ProductSearchModel(null, null, null, null, [this.brandId])
    )
      .pipe(switchMap(page => {

          const items = page.items.map(item => new ProductCard(item.id, item.title, item.description, item.price,
            new BrandDetailsViewModel(item.brandId)));

          const obs1 = forkJoin(items.map(product => {
            return this._productService.getProductOverviewImageUrl(product.id)
              .pipe(tap(imageUrl => product.imageUrl = imageUrl));
          })).pipe(defaultIfEmpty([]));

          const obs2 = forkJoin(items.map(product =>
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
}
