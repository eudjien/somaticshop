import {Component, OnInit} from '@angular/core';
import {zip} from 'rxjs';
import {defaultIfEmpty, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {Page} from '../../../models/Page';
import {ProductCard} from '../../../viewModels/ProductCard';
import {ProductService} from '../../../services/product.service';
import {BrandService} from '../../../services/brand.service';
import {AppConstants} from '../../../app-constants';
import {PageEvent} from '@angular/material/paginator';
import {ProductSearchModel} from '../../../models/search/ProductSearchModel';
import {BrandDetailsViewModel} from '../../../viewModels/BrandDetailsViewModel';
import {ActivatedRoute, Router} from '@angular/router';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
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
export class SearchComponent implements OnInit {

  searchValue: string;

  isLoading = false;

  page: Page<ProductCard>;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _brandService: BrandService) {
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.searchValue = params['q'] || '';
      this.loadPage(this.page?.pageNumber ?? 1, this.searchValue);
    });
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1, this.searchValue);
  }

  private loadPage(pageNumber: number = 1, searchInput: string): void {
    this.isLoading = true;

    const sModel = new ProductSearchModel();
    sModel.titles = [searchInput];

    const res = this._productService.getProductsPage(
      pageNumber ?? 1, null, sModel)
      .pipe(defaultIfEmpty(null), switchMap(page => {

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
      this.isLoading = false;
    });
  }
}
