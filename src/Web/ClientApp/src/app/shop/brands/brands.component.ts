import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {BrandService} from '../../../services/brand.service';
import {CatalogService} from '../../../services/catalog.service';
import {Page} from '../../../models/Page';
import {BrandCard} from '../../../viewModels/BrandCard';
import {Brand} from '../../../models/Brand';
import {Subject, zip} from 'rxjs';
import {debounceTime, mapTo, mergeMap, tap} from 'rxjs/operators';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {ActiveBreadcrumbItem, BreadcrumbItem, LinkBreadcrumbItem} from '../shop-core/breadcrumbs/breadcrumbs.component';
import {BrandSort} from '../../../models/sort/BrandSort';
import {BrandSearch} from '../../../models/search/BrandSearch';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss'],
  animations: [
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
            style({
              opacity: 0,
              transform: 'scale(0.9)',
            }),
            stagger(100, [animate('300ms', style({opacity: 1, transform: 'none'}))])
          ], {optional: true}
        )
      ])
    ]),
  ]
})
export class BrandsComponent implements OnInit {
  isLoading = false;
  id: number = +this._route.snapshot.paramMap.get('id');
  page: Page<BrandCard>;
  brand: Brand;

  sort: BrandSort = null;
  search: BrandSearch = null;

  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  searchValue: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService) {

    this.searchSubject.subscribe(value => {
      if (value) {
        this.search = new BrandSearch();
        this.search.names = [...value];
      } else {
        this.search = null;
      }
      this.loadPage();
    });
  }

  get breadcrumbs(): BreadcrumbItem[] {
    return [
      new LinkBreadcrumbItem('/', 'Главная'),
      new ActiveBreadcrumbItem('Бренды')
    ];
  }

  ngOnInit(): void {
    this.loadPage();
  }

  searchChange(value: string) {
    this.searchSubject.next(value);
  }

  sortChange(sort: Sort) {
    if (sort.active === 'products') {

      switch (sort.direction) {
        case 'asc':
          this.sort = BrandSort.ProductsAsc;
          break;
        case 'desc':
          this.sort = BrandSort.ProductsDesc;
          break;
        default:
          this.sort = null;
          break;
      }

      this.loadPage(this.page.pageIndex);
    }
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex);
  }

  private loadPage(pageIndex: number = 0): void {

    this.isLoading = true;
    const res = this._brandService.brandsPage(pageIndex, this.search, this.sort, 10)
      .pipe(
        mergeMap(page => {
          const items = page.items.map(item => new BrandCard(item.id, item.name, item.content));

          const obs1 = zip(...items.map(brand =>
            this._brandService.getBrandImageUrl(brand.id)
              .pipe(tap((imageUrl) => brand.imageUrl = imageUrl))));

          return obs1.pipe(mapTo(new Page<BrandCard>(items,
            page.pageIndex, page.totalPages, page.totalItems, page.hasPreviousPage, page.hasNextPage)));
        })
      );
    res.subscribe(page => {
      this.page = page;
    }).add(() => this.isLoading = false);
  }
}
