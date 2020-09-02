import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {CatalogService} from '../../../services/catalog.service';
import {ActivatedRoute, ActivatedRouteSnapshot, DetachedRouteHandle, Params, Router, RouteReuseStrategy} from '@angular/router';
import {BrandService} from '../../../services/brand.service';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {Catalog} from '../../../models/catalog/Catalog';
import {EMPTY, iif, of, Subject, Subscription, zip} from 'rxjs';
import {debounceTime, defaultIfEmpty, map, mergeAll, switchMap, switchMapTo, take, tap} from 'rxjs/operators';
import {MediaObserver} from '@angular/flex-layout';
import {MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {CatalogProductListComponent} from './catalog-product-list/catalog-product-list.component';
import {AppConstants} from '../../../app-constants';
import {PriceRange} from '../../../models/PriceRange';
import {Location} from '@angular/common';
import {ChangeContext, Options} from 'ng5-slider';
import {CatalogProductsFilter} from './CatalogProductsFilter';
import {SelectionModel} from '@angular/cdk/collections';

class CatalogViewModel {
  constructor(
    public parents?: Catalog[],
    public current?: Catalog,
    public childrens?: Catalog[],
    public specifications?: { name: string, values: string[] }[],
    public priceRange?: PriceRange,
    public brands?: BrandWithImage[]) {
  }
}

class BrandWithImage {
  constructor(
    public id?: number,
    public title?: string,
    public content?: string,
    public imageUrl?: string) {
  }
}

class CatalogRouteReuseStrategy extends RouteReuseStrategy {
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
  }

  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return false;
  }

  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    return null;
  }

  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return (future.routeConfig === curr.routeConfig) || future.data.reuse;
  }
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss'],
  encapsulation: ViewEncapsulation.None,
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
export class CatalogsComponent implements OnInit, OnDestroy, AfterViewInit {

  updateSubject: Subject<CatalogProductsFilter> = new Subject<CatalogProductsFilter>()
    .pipe(debounceTime(1000)) as Subject<CatalogProductsFilter>;

  catalogProductsFilter: CatalogProductsFilter;

  isLoading = false;
  productsIsLoading = false;

  @Input()
  empty = false;

  viewModel: CatalogViewModel;

  sidenavMode$ = this._mediaObserver.asObservable()
    .pipe(map(c => c[2].mqAlias === 'lt-lg' ? 'over' : 'side'));

  @ViewChild('catalogProductList')
  catalogProductList: CatalogProductListComponent;
  @ViewChildren('catalogProductList')
  catalogProductListQuery: QueryList<CatalogProductListComponent>;

  @ViewChild('specList')
  specSelectionList: MatSelectionList;
  @ViewChildren('specList')
  specSelectionListQuery: QueryList<MatSelectionList>;

  @ViewChild('brandList')
  brandList: MatSelectionList;
  @ViewChildren('brandList')
  brandListQuery: QueryList<MatSelectionList>;

  priceRange = {lower: null, upper: null};
  priceRangeOptions: Options;
  selectedSpecifications: SelectionModel<{ key: string; value: string }>
    = new SelectionModel<{ key: string; value: string }>(true, []);
  private paramsSubscription: Subscription;

  // ----
  private queryParamsSubscription: Subscription;

  // ----

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService,
    private _mediaObserver: MediaObserver,
    private _cdRef: ChangeDetectorRef) {
    _router.routeReuseStrategy = new CatalogRouteReuseStrategy();
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {

    this.updateSubject.subscribe(filter => {
      this.catalogProductsFilter = filter;
    });

    this.queryParamsSubscription = this._route.queryParams.subscribe((params) => {

      if (this.viewModel) {

        const brandIds = this.createBrandIdsFromParams();
        const specifications = this.createSpecificationsFromParams();
        const priceRange = new PriceRange(this.priceRange.lower, this.priceRange.upper);

        const filter = new CatalogProductsFilter(this.viewModel.current?.id, priceRange, brandIds, specifications);

        this.updateSubject.next(filter);
      }
    });

    this.paramsSubscription = this._route.params.subscribe(params => {
      this.isLoading = true;
      console.log('params update');

      const id = params['id'] ? +params['id'] : null;

      zip(
        id ? this._catalogService.catalogById(id) : of(<Catalog>null),
        id ? this._catalogService.parentsFor(id, false).pipe(map(ps => ps.reverse()), defaultIfEmpty(<Catalog[]>null)) : of(<Catalog[]>null),
        this._catalogService.childsFor(id, 1).pipe(defaultIfEmpty(<Catalog[]>null))
      )
        .pipe(switchMap(([current, parents, childs]) =>
          this._catalogService.hasProducts(id).pipe(switchMap(notEmpty => iif(() => notEmpty, zip(
            of(current),
            of(parents),
            of(childs),
            this._catalogService.specificationsFor(current?.id),
            this._catalogService.priceRangeFor(current?.id),
            this._catalogService.brandsFor(current?.id).pipe(map(bs =>
              zip(...bs.map(b => this._brandService.getBrandImageUrl(b.id)
                .pipe(defaultIfEmpty(''), map(bi => new BrandWithImage(b.id, b.title, b.content, bi)))))), mergeAll()),
          ), of(true).pipe(tap((empty) => {
            this.viewModel = new CatalogViewModel(parents, current, childs);
            this.catalogProductsFilter = null;
            console.log('EMPTY!!!!');
            this.empty = empty;
          }), switchMapTo(EMPTY)))))))
        .subscribe(([current, parents, childs, specifications, priceRange, brandsWithImages]) => {
          this.empty = false;
          this.viewModel = new CatalogViewModel(parents, current, childs, specifications, priceRange, brandsWithImages);

          this.initBrand();
          this.initSpecificationsList();
          this.initPriceRangeSlider();

          this.catalogProductsFilter = new CatalogProductsFilter(
            current?.id,
            new PriceRange(this.priceRange.lower, this.priceRange.upper),
            this.createBrandIdsFromParams(),
            this.createSpecificationsFromParams());
          this._cdRef.detectChanges();
        }).add(() => this.isLoading = false);
    });
  }

  ngOnDestroy(): void {
    console.log('destroy');
    this.paramsSubscription.unsubscribe();
    this.queryParamsSubscription.unsubscribe();
  }

  userPriceRangeChange($event: ChangeContext) {
    const prefix = 'price.';
    const fromPrefix = 'from';
    const toPrefix = 'to';
    let params = this.updateParamValue(prefix + fromPrefix, String($event.value), this._router.routerState.snapshot.root.queryParams);
    params = this.updateParamValue(prefix + toPrefix, String($event.highValue), params);

    this.navigate(params);
  }

  specificationChange($event: MatSelectionListChange) {
    const selected = $event.option.selected;
    const item = <{ key: string; value: string }>$event.option.value;

    if (selected) {
      this.selectedSpecifications.select(item);
    } else {
      this.selectedSpecifications.deselect(item);
    }

    const key = 'spec.' + item.key;

    let params: Params;
    if (selected) {
      params = this.appendParam(key, item.value, this._router.routerState.snapshot.root.queryParams);
    } else {
      params = this.deleteParam(key, item.value, this._router.routerState.snapshot.root.queryParams);
    }

    this.navigate(params);
  }

  brandChange($event: MatSelectionListChange) {
    const selected = $event.option.selected;

    const key = 'brand';
    const value = String($event.option.value);

    let params: Params;
    if (selected) {
      params = this.appendParam(key, value, this._router.routerState.snapshot.root.queryParams);
    } else {
      params = this.deleteParam(key, value, this._router.routerState.snapshot.root.queryParams);
    }

    this.navigate(params);
  }

  productsLoadingChange(loading: boolean) {

    this.productsIsLoading = loading;
    this._cdRef.detectChanges();
  }

  private updateParamValue(name: string, value: string, _params: Params): Params {
    const params = Object.assign({}, _params);
    params[name] = value;
    return params;
  }

  private appendParam(name: string, value: string, _params: Params): Params {
    const params = Object.assign({}, _params);
    if (!params[name]) {
      params[name] = value;
    } else {
      if (Array.isArray(params[name])) {
        if (params[name]?.length > 0) {
          const index = (params[name] as []).findIndex(a => a === value);
          if (index < 0) {
            params[name] = [...params[name], value];
          }
        } else {
          params[name] = value;
        }
      } else {
        if (params[name] !== value) {
          params[name] = [params[name], value];
        }
      }
    }
    return params;
  }

  private deleteParam(name: string, value: string, _params: Params): Params {
    const params = Object.assign({}, _params);

    if (Array.isArray(params[name])) {
      if (params[name].length > 0) {
        const values = (params[name] as string[]).filter(v => v !== value);
        if (values?.length === 0) {
          params[name] = undefined;
        } else if (values.length === 1) {
          params[name] = values[0];
        } else {
          params[name] = values;
        }
      }
    } else {
      params[name] = undefined;
    }
    return Object.keys(params).length !== 0 ? params : undefined;
  }

  private navigate(params: Params): void {
    this._router.navigate(
      ['.'],
      {
        relativeTo: this._route,
        queryParamsHandling: params ? 'merge' : undefined,
        queryParams: params
      });
  }

  private createSpecificationsFromParams(): Map<string, string[]> {
    const prefix = 'spec.';
    const params = this._router.routerState.snapshot.root.queryParams;
    const specs = new Map<string, string[]>();

    const specifications = this.viewModel.specifications;

    Object.keys(params).filter(k => k.startsWith(prefix) && params[k])
      .forEach(k => {
        const paramName = k.slice(prefix.length);

        if (Array.isArray(params[k])) {
          const paramValues = (params[k] as string[])
            .filter(pVal => specifications.some(s => s.name === paramName && s.values.some(sVal => sVal === pVal)));
          if (paramValues?.length > 0) {
            specs.set(paramName, paramValues);
          }
        } else {
          if (specifications.some(s => s.name === paramName && s.values.some(sVal => sVal === params[k]))) {
            specs.set(paramName, [params[k]]);
          }
        }
      });
    return specs;
  }

  private createBrandIdsFromParams(): number[] {
    const name = 'brand';
    const params = this._router.routerState.snapshot.root.queryParams;
    const brandIds: number[] = [];
    Object.keys(params).filter(k => k === name && params[k]).forEach(k => {
      if (Array.isArray(params[k])) {
        brandIds.push(...params[k]);
      } else {
        brandIds.push(params[k]);
      }
    });
    return brandIds;
  }

  private initPriceRangeSlider() {

    const prefix = 'price.';
    const toPrefix = 'to';
    const fromPrefix = 'from';

    const params = this._router.routerState.snapshot.root.queryParams;
    const fromVal = params[prefix + fromPrefix];
    const toVal = params[prefix + toPrefix];

    this.priceRangeOptions = {
      floor: this.viewModel.priceRange.from,
      ceil: this.viewModel.priceRange.to,
      step: 0.1
    };

    if (isNaN(fromVal) || fromVal < this.viewModel.priceRange.from) {
      this.priceRange.lower = this.viewModel.priceRange.from;
    } else {
      this.priceRange.lower = fromVal;
    }
    if (isNaN(toVal) || toVal > this.viewModel.priceRange.to) {
      this.priceRange.upper = this.viewModel.priceRange.to;
    } else {
      this.priceRange.upper = toVal;
    }
  }

  private initBrand() {

    const name = 'brand';

    const params = this._router.routerState.snapshot.root.queryParams;
    const value = params[name];

    this.brandListQuery.changes.pipe(take(1)).subscribe(() => {
      if (Array.isArray(value)) {
        const vArr = value as string[];
        vArr.forEach(v => {
          const option = this.brandList.options.find(o => String(o.value) === v);
          if (option) {
            option.selected = true;
          }
        });
      } else {
        console.log(value);
        const v = value as string;
        this.brandList.options.forEach(a => {
          console.log(a.value);
        });
        const option = this.brandList.options.find(o => String(o.value) === v);
        if (option) {
          option.selected = true;
        }
      }
    });
  }

  private initSpecificationsList() {
    const prefix = 'spec.';
    const params = this._router.routerState.snapshot.root.queryParams;
    this.specSelectionListQuery.changes.pipe(take(1)).subscribe(() => {
      this.specSelectionList.options.forEach(option => {
        const listValue = (<{ key: string, value: string }>option.value);
        Object.keys(params).filter(k => k === (prefix + listValue.key) && params[k])
          .forEach(k => {
            if ((Array.isArray(params[k]) && (params[k] as string[]).some(a => a === listValue.value))
              || (params[k] === listValue.value)) {
              option.selected = true;
            }
          });
      });
    });
  }
}
