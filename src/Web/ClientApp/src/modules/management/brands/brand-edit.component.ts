import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {BrandService} from '../../../services/brand.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ActivatedRoute, Router} from '@angular/router';
import {Brand} from '../../../models/Brand';
import {EditorComponent} from '../editor/editor.component';
import {FileService} from '../../../services/file.service';
import {IBrandImage} from '../../../interfaces/IBrandImage';
import {HttpHeaders, HttpResponse} from '@angular/common/http';
import {UploadImageSingleComponent} from '../upload-image-single/upload-image-single.component';

@Component({
  selector: 'app-brand-edit',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss']
})
export class BrandEditComponent implements OnInit, AfterViewInit {

  isLoading = false;

  id: number = +this._route.snapshot.paramMap.get('id');
  title = new FormControl('', [Validators.required]);

  @ViewChild('editor')
  editor: EditorComponent;
  @ViewChild('uploadImage')
  uploadImage: UploadImageSingleComponent;

  constructor(
    private _brandService: BrandService,
    private _fileService: FileService,
    private _snackbar: MatSnackBar,
    private _router: Router,
    private _route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
  }

  sendClick() {
    const brand: Brand = {
      id: this.id,
      title: this.title.value,
      content: this.editor.stringify()
    };
    this.updateRequest(brand, this.uploadImage.images.map(a => a.file)[0]);
  }

  private updateRequest(brand: Brand, file: File): void {
    this.isLoading = true;
    this._brandService.updateBrand(brand, file).subscribe(() => {
      this.openSuccessSnackbar();
    }, error => {
      this.openFailSnackbar();
    }).add(() => this.isLoading = false);
  }

  private load() {
    this.isLoading = true;
    this._brandService.getBrandById(this.id).subscribe(async (brand: Brand) => {
      this.title.setValue(brand.title);
      this.editor.parse(brand.content);
      this.getBrandImage();
    }, error => {

    }).add(() => {
      this.isLoading = false;
    });
  }

  private getBrandImage() {
    this._brandService.getBrandImage(this.id).subscribe((brandImage: IBrandImage) => {
      if (brandImage) {
        this._fileService.getFileById(brandImage.fileId).subscribe((response: HttpResponse<Blob>) => {
          const fileName = this.getFileName(response.headers);
          const blobPart = <BlobPart>response.body;
          const file = new File([blobPart], fileName, {type: this.getContentType(response.headers)});
          this.uploadImage.fileAddSubject.next(file);
        }, error => {

        });
      }
    }, error => {

    });
  }

  private getFileName(httpHeaders: HttpHeaders): string {
    return httpHeaders.get('Content-Disposition').split(';')[1].split('=')[1];
  }

  private getContentType(httpHeaders: HttpHeaders): string {
    return httpHeaders.get('Content-Type');
  }

  private openSuccessSnackbar(): void {
    this._snackbar.open('Бренд обновлен', null, {duration: 3500});
  }

  private openFailSnackbar(): void {
    this._snackbar.open('При обновлении бренда произошла ошибка', null, {duration: 3500});
  }
}
