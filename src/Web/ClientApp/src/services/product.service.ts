import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Page} from '../models/Page';
import {Product} from '../models/product/Product';
import {ProductGroup} from '../models/product/ProductGroup';
import {ProductSpec} from '../models/product/ProductSpec';
import {IFile} from '../interfaces/IFile';
import {Brand} from '../models/Brand';
import {map} from 'rxjs/operators';
import {ProductSearchModel} from '../models/search/ProductSearchModel';
import {serialize} from 'object-to-formdata';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  public getProductById(productId: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.baseUrl}api/products/${productId}`);
  }

  public getProductBrand(productId: number): Observable<Brand> {
    return this.httpClient.get<Brand>(`${this.baseUrl}api/products/${productId}/brand`);
  }

  public getProductGroupById(id: number): Observable<ProductGroup> {
    return this.httpClient.get<ProductGroup>(`${this.baseUrl}api/productGroups/${id}`);
  }

  public getProducts(
    searchModel?: ProductSearchModel,
    sort?: Map<string, string>): Observable<Product[]> {

    let params = new HttpParams();

    if (sort) {
      sort.forEach((value, key) => {
        params = params.append(`sort.${key}`, value);
      });
    }

    if (searchModel) {
      searchModel.ids?.forEach(id => params = params.append('search.id', String(id)));
      searchModel.titles?.forEach(title => params = params.append('search.title', title));
      searchModel.groupIds?.forEach(groupId => params = params.append('search.groupId', groupId ? String(groupId) : ''));
      searchModel.catalogIds?.forEach(catalogId => params = params.append('search.catalogId', catalogId ? String(catalogId) : ''));
      searchModel.brandIds?.forEach(brandId => params = params.append('search.brandId', brandId ? String(brandId) : ''));
    }

    return this.httpClient.get<Product[]>(`${this.baseUrl}api/products`, {params: params});
  }

  public getProductsPage(
    page: number,
    sort?: Map<string, string>,
    searchModel?: ProductSearchModel,
    specs?: Map<string, string[]>,
    pageSize: number = 10): Observable<Page<Product>> {

    let params = new HttpParams();
    params = params.set('page', String(page));
    params = params.set('pageSize', String(pageSize) ?? '');

    sort?.forEach((value, key) => params = params.append(`sort.${key}`, value));

    let i = 0;
    specs?.forEach((values, key) => {
      values?.forEach((value, idx) => {
        params = params.append(`spec[${i + idx}][0]`, key);
        params = params.append(`spec[${i + idx}][1]`, value);
      });
      i += values.length;
    });

    if (searchModel) {
      searchModel.ids?.forEach(id => params = params.append('search.id', String(id)));
      searchModel.titles?.forEach(title => params = params.append('search.title', title));
      searchModel.groupIds?.forEach(groupId => params = params.append('search.groupId', groupId ? String(groupId) : ''));
      searchModel.catalogIds?.forEach(catalogId => params = params.append('search.catalogId', catalogId ? String(catalogId) : ''));
      searchModel.brandIds?.forEach(brandId => params = params.append('search.brandId', brandId ? String(brandId) : ''));
    }

    return this.httpClient.get<Page<Product>>(`${this.baseUrl}api/products`, {params: params});
  }

  public getProductGroupsPage(page: number, sortTitle: string = null, search: string = null): Observable<Page<ProductGroup>> {
    let params = new HttpParams();
    params = params.set('page', String(page));
    if (sortTitle) {
      params = params.set('sortTitle', sortTitle);
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.httpClient.get<Page<ProductGroup>>(`${this.baseUrl}api/productGroups`, {params: params});
  }

  public getProductSpecifications(productId: number): Observable<ProductSpec[]> {
    return this.httpClient.get<ProductSpec[]>(`${this.baseUrl}api/products/${productId}/specifications`);
  }

  public getGroupProducts(groupId: number): Observable<Product[]> {
    if (!groupId) {
      return of([]);
    }
    return this.httpClient.get<Product[]>(`${this.baseUrl}api/productGroups/${groupId}/products`);
  }

  public getProductImageFiles(productId: number): Observable<IFile[]> {
    return this.httpClient.get<IFile[]>(`${this.baseUrl}api/products/${productId}/images`);
  }

  public getProductImageUrls(productId: number): Observable<string[]> {
    return this.httpClient.get<IFile[]>(`${this.baseUrl}api/products/${productId}/images`)
      .pipe(map(files => files.map(file => `${this.baseUrl}api/files/${file.id}`)));
  }

  public getProductOverviewImageFile(productId: number): Observable<IFile> {
    return this.httpClient.get<IFile>(`${this.baseUrl}api/products/${productId}/images/first`);
  }

  public getProductOverviewImageUrl(productId: number): Observable<string> {
    return this.httpClient.get<IFile>(`${this.baseUrl}api/products/${productId}/images/first`)
      .pipe(map(file => `${this.baseUrl}api/files/${file.id}`));
  }

  public createProduct(
    product: Product,
    imageFiles?: File[],
    specifications?: ProductSpec[]
  ): Observable<Product> {

    const formData = new FormData();
    serialize(product, null, formData, 'product');
    serialize(specifications, {indices: true}, formData, 'specification');
    imageFiles.forEach(image => formData.append('image', image));

    return this.httpClient.post<Product>(`${this.baseUrl}api/products`, formData);
  }

  public updateProduct(
    product: Product,
    imageFiles?: File[],
    specifications?: ProductSpec[]): Observable<Product> {

    const formData = new FormData();
    serialize(product, null, formData, 'product');
    serialize(specifications, {indices: true}, formData, 'specification');
    imageFiles.forEach(image => formData.append('image', image));

    return this.httpClient.put<Product>(`${this.baseUrl}api/products`, formData);
  }

  public createProductGroup(productGroup: ProductGroup, productIds?: number[]): Observable<ProductGroup> {
    const query = productIds?.map(id => `productId=${id}`).reduce((a, b) => `${a}&${b}`, null);
    return this.httpClient.post<ProductGroup>(`${this.baseUrl}api/productGroups${query ? '?' + query : ''}`, productGroup);
  }

  public updateProductGroup(productGroup: ProductGroup, productIds?: number[]): Observable<ProductGroup> {
    const query = productIds?.map(id => `productId=${id}`).reduce((a, b) => `${a}&${b}`, null);
    return this.httpClient.put<ProductGroup>(`${this.baseUrl}api/productGroups${query ? '?' + query : ''}`, productGroup);
  }

  public deleteProducts(productIds: number[]): Observable<any> {
    let params = new HttpParams();
    productIds.forEach(id => params = params.append('productId', String(id)));
    return this.httpClient.delete(`${this.baseUrl}api/products`, {params: params});
  }

  public deleteProductGroups(groupIds: number[]): Observable<any> {
    let params = new HttpParams();
    groupIds.forEach(id => params = params.append('groupId', String(id)));
    return this.httpClient.delete(`${this.baseUrl}api/productGroups`, {params: params});
  }
}
