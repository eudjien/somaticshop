import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ProductService} from '../../../services/product.service';
import {BrandService} from '../../../services/brand.service';
import {CatalogService} from '../../../services/catalog.service';
import {Page} from '../../../models/Page';
import {BrandCard} from '../../../viewModels/BrandCard';
import {Brand} from '../../../models/Brand';
import {Subject, zip} from 'rxjs';
import {debounceTime, mapTo, mergeMap, tap} from 'rxjs/operators';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

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
  sortTitle = '';
  searchTitle = '';
  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;
  @ViewChild('paginator')
  paginator: MatPaginator;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService) {

    this.searchSubject.subscribe(value => {
      this.searchTitle = value;
      this.loadPage();
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  searchChange($event: string) {
    this.searchSubject.next($event);
  }

  sortChange(sort: Sort) {
    if (sort.active === 'title') {
      this.sortTitle = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageNumber);
    }
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  private loadPage(pageNumber: number = 1): void {

    this.isLoading = true;
    const res = this._brandService.getBrandsPage(
      pageNumber,
      this.sortTitle ? this.sortTitle : null,
      this.searchTitle ? this.searchTitle : null)
      .pipe(
        mergeMap(page => {
          const items = page.items.map(item => new BrandCard(item.id, item.title, item.content));

          const obs1 = zip(...items.map(brand =>
            this._brandService.getBrandImageUrl(brand.id)
              .pipe(tap((imageUrl) => brand.imageUrl = imageUrl))));

          return obs1.pipe(mapTo(new Page<BrandCard>(items,
            page.pageNumber, page.totalPages, page.totalItems, page.hasPreviousPage, page.hasNextPage)));
        })
      );
    res.subscribe(page => {
      this.page = page;
    }).add(() => this.isLoading = false);
  }
}
