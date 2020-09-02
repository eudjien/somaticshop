import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {
  }

  public getFileById(fileId: string): Observable<HttpResponse<Blob>> {
    return this.httpClient.get(`${this.baseUrl}api/files/${fileId}`, {responseType: 'blob', observe: 'response'});
  }

  public getFileUrl(fileId: string): string {
    return `${this.baseUrl}api/files/${fileId}`;
  }
}
