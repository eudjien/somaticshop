import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ProductService} from '../../../../../services/product.service';
import {ProductSearch} from '../../../../../models/search/ProductSearch';
import {Subject, zip} from 'rxjs';
import {Page} from '../../../../../models/Page';
import {debounceTime, defaultIfEmpty, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {ProductCard} from '../../../../../viewModels/ProductCard';
import {BrandDetailsViewModel} from '../../../../../viewModels/BrandDetailsViewModel';
import {BrandService} from '../../../../../services/brand.service';
import {AppConstants} from '../../../../../app-constants';

@Component({
  selector: 'app-search-header-dropdown',
  templateUrl: './search-header-dropdown.component.html',
  styleUrls: ['./search-header-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchHeaderDropdownComponent implements OnInit {

  searchValue: string;
  isLoading = false;
  subj = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  page: Page<ProductCard>;

  constructor(
    private _productService: ProductService,
    private _brandService: BrandService) {
  }

  @Input()
  set search(searchValue: string) {
    this.subj.next(searchValue);
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
    this.subj.subscribe(searchValue => {
      this.searchValue = searchValue;
      this.loadPage(this.page?.pageIndex ?? 1, searchValue);
    });
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1, this.searchValue);
  }

  private loadPage(pageIndex: number = 1, searchInput: string): void {
    this.isLoading = true;

    const sModel = new ProductSearch();
    sModel.names = [searchInput];

    const res = this._productService.productsPage(
      pageIndex ?? 1, sModel)
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
            page.pageIndex, page.totalPages, page.totalItems, page.hasPreviousPage, page.hasNextPage)));
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
