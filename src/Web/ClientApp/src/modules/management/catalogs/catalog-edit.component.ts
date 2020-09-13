import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {FileService} from '../../../services/file.service';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {UploadImageSingleComponent} from '../upload-image-single/upload-image-single.component';
import {CatalogService} from '../../../services/catalog.service';
import {ICatalogImage} from '../../../interfaces/ICatalogImage';
import {Catalog} from '../../../models/catalog/Catalog';
import {SelectCatalogForCatalogComponent} from '../selects/select-catalog-for-catalog/select-catalog-for-catalog.component';

@Component({
  selector: 'app-catalog-edit',
  templateUrl: './catalog-edit.component.html',
  styleUrls: ['./catalog-edit.component.scss']
})
export class CatalogEditComponent implements OnInit, AfterViewInit {

  isLoading = false;

  id: number = +this._route.snapshot.paramMap.get('id');
  name = new FormControl('', [Validators.required]);

  @ViewChild('uploadImage')
  uploadImage: UploadImageSingleComponent;
  @ViewChild('selectCatalogForCatalog')
  selectCatalogForCatalog: SelectCatalogForCatalogComponent;

  constructor(
    private _catalogService: CatalogService,
    private _fileService: FileService,
    private _snackbar: MatSnackBar,
    private _router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.loadCatalog(this.id);
  }

  ngAfterViewInit(): void {
  }

  sendClick() {
    const catalog: Catalog = {
      id: this.id,
      name: this.name.value,
      parentCatalogId: this.selectCatalogForCatalog.selected?.id
    };
    this.updateData(catalog, this.uploadImage.images.map(a => a.file)[0]);
  }

  private updateData(catalog: Catalog, file: File): void {
    this.isLoading = true;
    this._catalogService.updateCatalog(catalog, file)
      .subscribe((updatedCatalog: Catalog) => {
        this._snackbar.open('Бренд обновлен', null, {duration: 3500});
      }, error => {
        this._snackbar.open('При обновлении бренда произошла ошибка', null, {duration: 3500});
      }).add(() => this.isLoading = false);
  }

  private loadCatalog(id: number) {
    this.isLoading = true;
    this._catalogService.catalogById(id)
      .subscribe((catalog: Catalog) => {
        this.name.setValue(catalog.name);
        this.loadCatalogImage();
        if (catalog.parentCatalogId) {
          this.selectCatalogForCatalog.catalog = catalog;
        }
      }).add(() => this.isLoading = false);
  }

  private loadCatalogImage() {
    this._catalogService.getCatalogImage(this.id)
      .subscribe((catalogImage: ICatalogImage) => {
        if (catalogImage) {
          this._fileService.getFileById(catalogImage.fileId)
            .subscribe((response: HttpResponse<Blob>) => {
              const fileName = this.getFileName(response.headers);
              const blobPart = <BlobPart>response.body;
              const file = new File([blobPart], fileName, {type: this.getContentType(response.headers)});
              this.uploadImage.fileAddSubject.next(file);
            });
        }
      });
  }

  private getFileName(httpHeaders: HttpHeaders): string {
    return httpHeaders.get('Content-Disposition').split(';')[1].split('=')[1];
  }

  private getContentType(httpHeaders: HttpHeaders): string {
    return httpHeaders.get('Content-Type');
  }
}
