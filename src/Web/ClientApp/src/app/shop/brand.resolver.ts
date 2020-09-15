import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable} from 'rxjs';
import {defaultIfEmpty, map, switchMap, take, tap} from 'rxjs/operators';
import {BrandService} from '../../services/brand.service';
import {Injectable} from '@angular/core';
import {Brand} from '../../models/Brand';
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html';

export class BrandResolveResult {
  constructor(
    public brand: Brand,
    public imageUrl?: string
  ) {
  }
}

@Injectable({providedIn: 'root'})
export class BrandResolver implements Resolve<BrandResolveResult> {

  constructor(private _brandService: BrandService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<BrandResolveResult> | Promise<BrandResolveResult> | BrandResolveResult {

    const id = Number.parseInt(route.params.id, 10);
    console.log(id);
    if (!Number.isNaN(id) && id > 0) {
      return this._brandService.getBrandById(id).pipe(
        tap(brand => brand.content = new QuillDeltaToHtmlConverter(JSON.parse(brand.content)).convert()),
        switchMap(brand => this._brandService.getBrandImageUrl(brand.id).pipe(
          defaultIfEmpty(''),
          map(brandImgUrl => new BrandResolveResult(brand, brandImgUrl)))
        )
      );
    }
    return EMPTY;
  }
}
