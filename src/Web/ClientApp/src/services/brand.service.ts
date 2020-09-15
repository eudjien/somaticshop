import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Page} from '../models/Page';
import {Brand} from '../models/Brand';
import {IBrandImage} from '../interfaces/IBrandImage';
import {map} from 'rxjs/operators';
import {serialize} from 'object-to-formdata';
import {BrandSearch} from '../models/search/BrandSearch';
import {BrandSort} from '../models/sort/BrandSort';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  public createBrand(brand: Brand, imageFile: File): Observable<Brand> {

    const formData = new FormData();
    serialize(brand, null, formData, 'brand');
    formData.set('image', imageFile);

    return this.httpClient.post<Brand>(`${this.baseUrl}api/brands`, formData);
  }

  public updateBrand(brand: Brand, imageFile: File): Observable<HttpResponse<any>> {

    const formData = new FormData();
    serialize(brand, null, formData, 'brand');
    formData.set('image', imageFile);

    return this.httpClient.put<HttpResponse<any>>(`${this.baseUrl}api/brands`, formData);
  }

  public getBrandById(brandId: number): Observable<Brand> {
    if (!brandId) {
      return of(null);
    }
    return this.httpClient.get<Brand>(`${this.baseUrl}api/brands/${brandId}`);
  }

  public getBrandImage(brandId: number): Observable<IBrandImage> {
    return this.httpClient.get<IBrandImage>(`${this.baseUrl}api/brands/${brandId}/image`);
  }

  public getBrandImageUrl(brandId: number): Observable<string> {
    return this.httpClient.get<IBrandImage>(`${this.baseUrl}api/brands/${brandId}/image`)
      .pipe(map(brandImage => brandImage ? `${this.baseUrl}api/files/${brandImage.fileId}` : null));
  }

  public brandsPage(pageIndex: number, search?: BrandSearch, sort?: BrandSort, pageSize = 10): Observable<Page<Brand>> {
    let params = new HttpParams();

    params = params.set('pageIndex', String(pageIndex));
    params = params.set('pageSize', String(pageSize));

    if (sort != null) {
      params = params.append('sort', String(sort));
    }

    if (search) {
      search.ids?.forEach(id => params = params.append('search.id', String(id)));
      search.names?.forEach(name => params = params.append('search.name', name));
    }

    return this.httpClient.get<Page<Brand>>(`${this.baseUrl}api/brands`, {params: params});
  }

  public deleteBrands(brandIds: number[]): Observable<any> {
    let params = new HttpParams();
    for (const id of brandIds) {
      params = params.append('brandId', String(id));
    }
    return this.httpClient.delete(`${this.baseUrl}api/brands`, {params: params});
  }
}
