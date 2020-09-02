import {Inject, Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {Page} from '../models/Page';
import {Brand} from '../models/Brand';
import {IBrandImage} from '../interfaces/IBrandImage';
import {map} from 'rxjs/operators';
import {serialize} from 'object-to-formdata';

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

  public getBrandsPage(page: number, sortTitle: string = null, search: string = null): Observable<Page<Brand>> {
    let params = new HttpParams();
    params = params.set('page', String(page));
    if (sortTitle) {
      params = params.set('sortTitle', sortTitle);
    }
    if (search) {
      params = params.set('search', search);
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
