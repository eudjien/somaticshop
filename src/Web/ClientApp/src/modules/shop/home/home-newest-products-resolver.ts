import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Observable, zip} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {CatalogService} from '../../../services/catalog.service';
import {Injectable} from '@angular/core';
import {BrandCard} from '../../../viewModels/BrandCard';
import {ProductCard} from '../../../viewModels/ProductCard';
import {BrandService} from '../../../services/brand.service';
import {ProductService} from '../../../services/product.service';

@Injectable({providedIn: 'root'})
export class HomeNewestProductsResolver implements Resolve<ProductCard[]> {

  constructor(private _catalogService: CatalogService,
              private _brandService: BrandService,
              private _productService: ProductService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<ProductCard[]> | Promise<ProductCard[]> | ProductCard[] {
    return this._productService.getProductsPage(1, new Map<string, string>().set('date', 'desc'), null, null, 5
    ).pipe(switchMap(pg =>
      zip(...pg.items.map(p =>
        zip(this._productService.getProductOverviewImageUrl(p.id),
          zip(this._brandService.getBrandById(p.brandId), this._brandService.getBrandImageUrl(p.brandId))
            .pipe(map(([b, biUrl]) => new BrandCard(b.id, b.title, b.content, biUrl))))
          .pipe(map(([pImg, brand]) => new ProductCard(p.id, p.title, p.description, p.price, brand, pImg)))))));
  }
}
