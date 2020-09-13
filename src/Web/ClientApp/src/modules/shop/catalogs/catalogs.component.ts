import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ProductService} from '../../../services/product.service';
import {CatalogService} from '../../../services/catalog.service';
import {ActivatedRoute, NavigationExtras, Params, Router} from '@angular/router';
import {BrandService} from '../../../services/brand.service';
import {Subject, Subscription, zip} from 'rxjs';
import {debounceTime, defaultIfEmpty, map, mapTo, mergeAll, switchMap, tap} from 'rxjs/operators';
import {MediaObserver} from '@angular/flex-layout';
import {MatSelectionListChange} from '@angular/material/list';
import {AppConstants} from '../../../app-constants';
import {PriceRange} from '../../../models/PriceRange';
import {Location} from '@angular/common';
import {ChangeContext, Options} from 'ng5-slider';
import {VIEW_CARD_MODE, VIEW_LIST_MODE} from '../product-layout/product-layout-header/layout-mode-header/layout-mode-header.component';
import {ActiveBreadcrumbItem, BreadcrumbItem, LinkBreadcrumbItem} from '../shop-core/breadcrumbs/breadcrumbs.component';
import {CatalogResolveResult} from '../catalog-resolver';
import {BrandCard} from '../../../viewModels/BrandCard';
import {Page} from '../../../models/Page';
import {ProductCard} from '../../../viewModels/ProductCard';
import {BrandDetailsViewModel} from '../../../viewModels/BrandDetailsViewModel';
import {ProductSearch} from '../../../models/search/ProductSearch';
import {ProductSort} from '../../../models/ProductSort';
import {Catalog} from '../../../models/catalog/Catalog';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogsComponent implements OnInit, OnDestroy {

  readonly PAGE_NUMBER_QUERY = 'page';
  readonly PAGE_SIZE_QUERY = 'pageSize';
  readonly SORT_QUERY = 'sort';
  readonly BRAND_QUERY = 'brand';
  readonly SPECIFICATION_QUERY = 's';

  page: Page<ProductCard>;
  layoutMode: 'list' | 'card' = VIEW_CARD_MODE;

  pageIndex = 0;
  pageSize = 10;
  sort: ProductSort = ProductSort.DateDesc;

  sorts: ProductSort[] = [ProductSort.DateDesc, ProductSort.PriceAsc, ProductSort.PriceDesc, ProductSort.OrdersDesc];

  cardSize = 4;

  @ViewChild('sideNav')
  sideNav: MatDrawer;

  updatePageSubject: Subject<ProductSearch> = new Subject<ProductSearch>()
    .pipe(debounceTime(1020)) as Subject<ProductSearch>;

  productsIsLoading = false;

  data: CatalogResolveResult;

  sidenavMode$ = this._mediaObserver.asObservable()
    .pipe(map(c => c[2].mqAlias === 'lt-lg' ? 'over' : 'side'));

  selectedBrands: BrandCard[] = [];
  selectedSpecifications: { id: number; key: string; value: string }[] = [];

  priceRange = {lower: null, upper: null};
  priceRangeOptions: Options;

  private queryParamsSubscription: Subscription;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location,
    private _productService: ProductService,
    private _brandService: BrandService,
    private _catalogService: CatalogService,
    private _mediaObserver: MediaObserver,
    private changeDetectorRef: ChangeDetectorRef) {
    this._router.routeReuseStrategy.shouldReuseRoute =
      (a, c) => a.params.id === c.params.id;

    this.data = this._route.snapshot.data.resolveResult as CatalogResolveResult;

    this.updatePageSubject.subscribe(nextSearch => {
      this.loadPage(this.pageIndex, this.pageSize, nextSearch);
    });

    this.queryParamsSubscription = this._route.queryParams.subscribe((params) => {

      if (this.data) {

        this.initAllFromQuery();
        const search = this.createSearch();

        const debounce = _router.getCurrentNavigation().extras.state?.debounce ?? false;

        if (this.page && debounce) {
          this.updatePageSubject.next(search);
        } else {
          this.loadPage(this.pageIndex, this.pageSize, search);
        }

      }
    });
  }

  get breadcrumbs(): BreadcrumbItem[] {
    const breadcrumbs: BreadcrumbItem[] = [];
    if (this.data) {
      if (this.data.currentCatalog) {
        breadcrumbs.push(new LinkBreadcrumbItem('/catalogs', 'Все'));
        if (this.data.parentCatalogs) {
          breadcrumbs.push(...this.data.parentCatalogs.map(p => new LinkBreadcrumbItem(`/catalogs/${p.id}`, p.name)));
        }
        breadcrumbs.push(new ActiveBreadcrumbItem(this.data.currentCatalog.name));
      } else {
        breadcrumbs.push(new ActiveBreadcrumbItem('Все'));
      }
    }
    return breadcrumbs;
  }

  private loadPage(pageIndex = 0, pageSize = 10, search: ProductSearch): void {

    this.productsIsLoading = true;

    const res = this._productService.getProductsPage(pageIndex, search, this.sort, pageSize)
      .pipe(switchMap(page => {

          const items = page.items.map(item => new ProductCard(item.id, item.name, item.description, item.price,
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

    }).add(() => this.productsIsLoading = false);
  }

  get firstChilds(): Catalog[] {
    return this.data.childCatalogs.filter(a => a.parentCatalogId === (this.data.currentCatalog?.id ?? null));
  }

  get layoutClass(): string {
    switch (this.layoutMode) {
      case VIEW_CARD_MODE:
        return 'drawer-container-card';
      case VIEW_LIST_MODE:
        return 'drawer-container-list';
      default:
        return 'drawer-container-list';
    }
  }

  ngOnDestroy(): void {
    this.queryParamsSubscription.unsubscribe();
  }

  layoutModeChange(mode: 'card' | 'list') {
    this.layoutMode = mode;
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
  }

  productsLoadingChange(loading: boolean) {
    this.productsIsLoading = loading;
    this.changeDetectorRef.detectChanges();
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

  private navigate(params: Params, debounce = true): void {
    this._router.navigate(
      ['.'],
      <NavigationExtras>{
        relativeTo: this._route,
        queryParamsHandling: params ? 'merge' : undefined,
        queryParams: params,
        state: {debounce: debounce}
      });
  }

  private createSearch(): ProductSearch {
    const priceRange = new PriceRange(this.priceRange.lower, this.priceRange.upper);
    const selectedBrandIds = this.selectedBrands.map(a => a.id);
    const selectedSpecificationIdValues = this.selectedSpecifications.map(a => ({nameId: a.id, value: a.value}));
    const search = new ProductSearch();
    search.catalogIds = (this.data.childCatalogs || []).concat(this.data.currentCatalog)?.map(a => a?.id).filter(a => !!a);
    search.priceRange = priceRange;
    search.brandIds = selectedBrandIds;
    search.specifications = selectedSpecificationIdValues;
    return search;
  }

  private initAllFromQuery() {
    this.initPageIndexFromQuery();
    this.initPageSizeFromQuery();
    this.initSortFromQuery();
    this.initBrandsFromQuery();
    this.initSpecificationsFromQuery();
    this.initPriceRangeSliderFromQuery();
  }

  private initPriceRangeSliderFromQuery() {
    if (this.data.priceRange) {
      const priceParams = this.priceParams;

      if (!priceParams.from || priceParams.from < this.data.priceRange.from) {
        this.priceRange.lower = this.data.priceRange.from;
      } else {
        this.priceRange.lower = priceParams.from;
      }
      if (!priceParams.to || priceParams.to > this.data.priceRange.to) {
        this.priceRange.upper = this.data.priceRange.to;
      } else {
        this.priceRange.upper = priceParams.to;
      }

      this.priceRangeOptions = <Options>{
        floor: this.data.priceRange.from,
        ceil: this.data.priceRange.to,
        step: 1,
        animate: false,
        noSwitching: true
      };
    }
  }

  private initBrandsFromQuery() {
    this.selectedBrands = [];
    const brandParams = this.brandParams;
    this.data.brands?.forEach(brand => {
      if (brandParams.some(brandName => brandName === brand.name)) {
        this.selectedBrands.push(brand);
      } else {
        this.selectedBrands = this.selectedBrands.filter(a => a.id !== brand.id);
      }
    });
  }

  private initSpecificationsFromQuery() {
    this.selectedSpecifications = [];
    const specificationParams = this.specificationParams;
    this.data.specifications?.forEach(specification => {
      specification.values.forEach(specificationValue => {
        if (specificationParams.some(a => a.key === specification.key && a.value === specificationValue)) {
          this.selectedSpecifications.push({id: specification.id, key: specification.key, value: specificationValue});
        } else {
          this.selectedSpecifications =
            this.selectedSpecifications.filter(a => !(a.id === specification.id && a.value === specificationValue));
        }
      });
    });
  }

  private initPageIndexFromQuery() {
    this.pageIndex = this.pageIndexParams;
  }

  private initPageSizeFromQuery() {
    this.pageSize = this.pageSizeParams;
  }

  private initSortFromQuery() {
    this.sort = this.sortParams;
  }

  brandIsSelected(brand: BrandCard) {
    return this.selectedBrands?.some(a => a.id === brand.id);
  }

  specificationIsSelected(spec: { id: number, value: string }) {
    return this.selectedSpecifications?.some(a => a.id === spec.id && a.value === spec.value);
  }

  private get priceParams(): PriceRange {
    const paramNameFrom = 'priceFrom';
    const paramNameTo = 'priceTo';

    const from = this._route.snapshot.queryParamMap.get(paramNameFrom);
    const to = this._route.snapshot.queryParamMap.get(paramNameTo);

    return new PriceRange(
      Number.isNaN(from) ? null : Number(from),
      Number.isNaN(to) ? null : Number(to),
    );
  }

  private get brandParams(): string[] {
    return this._route.snapshot.queryParamMap.getAll(this.BRAND_QUERY);
  }

  private get pageIndexParams(): number {
    const value = Number.parseInt(this._route.snapshot.queryParamMap.get(this.PAGE_NUMBER_QUERY), 10);
    if (!Number.isNaN(value) && value > 0) {
      return value - 1;
    }
    return 0;
  }

  private get pageSizeParams(): number {
    const value = Number.parseInt(this._route.snapshot.queryParamMap.get(this.PAGE_SIZE_QUERY), 10);
    if (!Number.isNaN(value) && value > 0) {
      return value;
    }
    return 10;
  }

  private get sortParams(): ProductSort {
    let value = this._route.snapshot.queryParamMap.get(this.SORT_QUERY);
    if (value?.length > 0) {
      value = value[0].toUpperCase() + value.slice(1);
    }

    const sort: ProductSort = ProductSort[value];

    if (!sort || !this.sorts.includes(sort)) {
      return ProductSort.DateDesc;
    }

    return sort;
  }

  private get specificationParams(): any[] {
    return this._route.snapshot.queryParamMap.getAll(this.SPECIFICATION_QUERY)
      .map(a => {
        try {
          const obj = JSON.parse(a);
          const key = Object.keys(obj)[0];
          const value = obj[key];
          return {key: key, value: value};
        } catch (err) {
          return null;
        }
      }).filter(a => !!a);
  }

  sideNavOpenStart() {
    this.cardSize = 4;
  }

  sideNavClosed() {
    this.cardSize = 5;
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }

  priceRangeChange($event: ChangeContext) {
    const fromPrefix = 'priceFrom';
    const toPrefix = 'priceTo';

    let params = this.updateParamValue(fromPrefix, String($event.value), this._route.snapshot.queryParams);
    params = this.updateParamValue(toPrefix, String($event.highValue), params);

    this.navigate(params);
  }

  specificationChange($event: MatSelectionListChange) {
    const selected = $event.option.selected;
    const spec = <{ id: number; key: string; value: string }>$event.option.value;

    const jsonString = JSON.stringify({[spec.key]: spec.value});

    let params: Params;
    if (selected) {
      params = this.appendParam(this.SPECIFICATION_QUERY, jsonString, this._route.snapshot.queryParams);
    } else {
      params = this.deleteParam(this.SPECIFICATION_QUERY, jsonString, this._route.snapshot.queryParams);
    }

    this.navigate(params);
  }

  brandChange($event: MatSelectionListChange) {
    const selected = $event.option.selected;
    const brand = <BrandCard>$event.option.value;

    let params: Params;
    if (selected) {
      params = this.appendParam(this.BRAND_QUERY, String(brand.name), this._route.snapshot.queryParams);
    } else {
      params = this.deleteParam(this.BRAND_QUERY, String(brand.name), this._route.snapshot.queryParams);
    }

    this.navigate(params);
  }

  pageChange(pageIndex: number) {
    const params = this.updateParamValue(this.PAGE_NUMBER_QUERY, String(pageIndex + 1), this._route.snapshot.queryParams);
    this.navigate(params, false);
  }

  sortChange(sort: ProductSort) {
    let sortString = ProductSort[sort];
    sortString = sortString[0].toLowerCase() + sortString.slice(1);
    const params = this.updateParamValue(this.SORT_QUERY, sortString, this._route.snapshot.queryParams);
    this.navigate(params, false);
  }

  pageSizeChange(pageSize: number) {
    const params = this.updateParamValue(this.PAGE_SIZE_QUERY, String(pageSize), this._route.snapshot.queryParams);
    this.navigate(params, false);
  }
}
