import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {BrandCard} from '../../viewModels/BrandCard';
import {Observable, of, zip} from 'rxjs';
import {Catalog} from '../../models/catalog/Catalog';
import {defaultIfEmpty, map, mergeAll, switchMap} from 'rxjs/operators';
import {PriceRange} from '../../models/PriceRange';
import {CatalogService} from '../../services/catalog.service';
import {CatalogCard} from '../../viewModels/CatalogCard';
import {BrandService} from '../../services/brand.service';
import {Injectable} from '@angular/core';
import {Brand} from '../../models/Brand';

export class CatalogResolveResult {
  constructor(
    public brands?: BrandCard[],
    public specifications?: { id: number, key: string, values: string[] }[],
    public priceRange?: PriceRange,
    public currentCatalog?: Catalog,
    public parentCatalogs?: Catalog[],
    public childCatalogs?: Catalog[],
    public hasProducts: boolean = false
  ) {
  }
}

@Injectable({providedIn: 'root'})
export class CatalogResolver implements Resolve<CatalogResolveResult> {

  constructor(private _catalogService: CatalogService, private _brandService: BrandService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<CatalogResolveResult> | Promise<CatalogResolveResult> | CatalogResolveResult {
    return this.request(route);
  }

  public request(route: ActivatedRouteSnapshot): Observable<CatalogResolveResult> {
    const id = route.params['id'] ? +route.params['id'] : null;

    return zip(
      id ? this._catalogService.catalogById(id) : of(<Catalog>null),
      this.getParentsOrNull(id),
      this.getChildrensOrNull(id),
    ).pipe(switchMap(([current, parents, childrens]) =>
      this._catalogService.hasProducts(id).pipe(switchMap(hasProducts => zip(
        of(hasProducts),
        zip(of(current), of(parents), of(childrens)),
        this.getSpecificationsOrNull(current?.id, hasProducts),
        this.getPriceRangeOrNull(current?.id, hasProducts),
        this.getBrandsOrNull(current?.id, hasProducts)
      )))), map(([hasProducts, [current, parents, childrens], specifications, priceRange, brands]) => {
      return new CatalogResolveResult(brands, specifications, priceRange, current, parents, childrens, hasProducts);
    }));
  }

  private getParentsOrNull(catalogId: number): Observable<Catalog[]> {
    return catalogId ? this._catalogService.parentsFor(catalogId, false)
      .pipe(map(ps => ps.reverse()), defaultIfEmpty(<Catalog[]>null)) : of(<Catalog[]>null);
  }

  private getChildrensOrNull(catalogId: number): Observable<Catalog[]> {
    return this._catalogService.childsFor(catalogId, null).pipe(defaultIfEmpty(<Catalog[]>null));
  }

  private getSpecificationsOrNull(catalogId: number, hasProducts: boolean): Observable<{ id: number, key: string, values: string[] }[]> {
    return hasProducts ? this._catalogService.specificationsFor(catalogId) : of(null);
  }

  private getPriceRangeOrNull(catalogId: number, hasProducts: boolean): Observable<PriceRange> {
    return hasProducts ? this._catalogService.priceRangeFor(catalogId) : of(null);
  }

  private getBrandsOrNull(catalogId: number, hasProducts: boolean): Observable<Brand[]> {
    return hasProducts ? this._catalogService.brandsFor(catalogId)
      .pipe(defaultIfEmpty(<Brand[]>null), map(bs => zip(...bs.map(b => this._brandService.getBrandImageUrl(b.id)
        .pipe(defaultIfEmpty(''), map(bi => new BrandCard(b.id, b.name, b.content, bi)))))), mergeAll()) : of(null);
  }
}
