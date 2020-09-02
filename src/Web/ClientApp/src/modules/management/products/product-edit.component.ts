import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProductService} from '../../../services/product.service';
import {Product} from '../../../models/product/Product';
import {EditorComponent} from '../editor/editor.component';
import {UploadImageMultiComponent} from '../upload-image-multi/upload-image-multi.component';
import {SelectGroupForProductComponent} from '../selects/select-group-for-product/select-group-for-product.component';
import {SelectSpecificationsComponent} from '../selects/select-specifications/select-specifications.component';
import {ProductSpec} from '../../../models/product/ProductSpec';
import {SelectBrandForProductComponent} from '../selects/select-brand-for-product/select-brand-for-product.component';
import {ActivatedRoute} from '@angular/router';
import {CatalogService} from '../../../services/catalog.service';
import {BrandService} from '../../../services/brand.service';
import {SelectCatalogForProductComponent} from '../selects/select-catalog-for-product/select-catalog-for-product.component';
import {HttpResponse} from '@angular/common/http';
import {FileService} from '../../../services/file.service';
import {IFile} from '../../../interfaces/IFile';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent implements OnInit, AfterViewInit {

  isLoading = false;

  id: number = +this._route.snapshot.paramMap.get('id');

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    price: new FormControl('', [Validators.required, Validators.min(0)])
  });

  @ViewChild('editor')
  editor: EditorComponent;
  @ViewChild('uploadImage')
  uploadImage: UploadImageMultiComponent;
  @ViewChild('selectCatalogForProduct')
  selectCatalogForProduct: SelectCatalogForProductComponent;
  @ViewChild('selectGroupForProduct')
  selectGroupComponent: SelectGroupForProductComponent;
  @ViewChild('selectSpecificationsForProduct')
  selectSpecificationsForProduct: SelectSpecificationsComponent;
  @ViewChild('selectBrandForProduct')
  selectBrandForProduct: SelectBrandForProductComponent;

  constructor(
    private _route: ActivatedRoute,
    private _productService: ProductService,
    private _catalogService: CatalogService,
    private _brandService: BrandService,
    private _fileService: FileService,
    private _snackbar: MatSnackBar) {
  }

  getErrorMessage() {
    if (this.formGroup.hasError('required')) {
      return 'Это поле обязательное для заполнения';
    } else {
      return '';
    }
  }

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
  }

  sendClick() {
    const product: Product = {
      id: this.id,
      title: this.formGroup.get('title').value,
      content: this.editor.stringify(),
      description: this.formGroup.get('description').value,
      price: this.formGroup.get('price').value,
      catalogId: this.selectCatalogForProduct.selected?.id,
      brandId: this.selectBrandForProduct.selected?.id,
      groupId: this.selectGroupComponent.selected?.id
    };
    this.updateRequest(product, this.uploadImage.images.map(a => a.file), this.selectSpecificationsForProduct.modified);
  }

  private load() {
    this.isLoading = true;
    this._productService.getProductById(this.id).subscribe(product => {
      this.selectCatalogForProduct.product
        = this.selectBrandForProduct.product
        = this.selectGroupComponent.product
        = this.selectSpecificationsForProduct.product = product;

      this.editor.parse(product.content);

      this.formGroup.setValue({
        title: product.title,
        description: product.description,
        price: product.price,
      });
      this.loadImages();
    }).add(() => this.isLoading = false);
  }

  private updateRequest(product: Product, imageFiles?: File[], specifications?: ProductSpec[]) {
    this.isLoading = true;
    this._productService.updateProduct(product, imageFiles, specifications)
      .subscribe(() => {
        this.openSuccessSnackbar();
      }, error => {
        this.openFailSnackbar();
      }).add(() => this.isLoading = false);
  }

  private loadImages() {
    this._productService.getProductImageFiles(this.id).subscribe((files: IFile[]) => {
      if (files) {
        files.forEach(imageFile => {

          this._fileService.getFileById(imageFile.id).subscribe((response: HttpResponse<Blob>) => {
            const blobPart = <BlobPart>response.body;
            const file = new File([blobPart], imageFile.fileName, {type: imageFile.contentType});
            this.uploadImage.fileAddSubject.next(file);
          }, error => {

          });

        });
      }
    }, error => {

    });
  }

  private openSuccessSnackbar(): void {
    this._snackbar.open('Продукт успешно обновлен!', null, {duration: 3500});
  }

  private openFailSnackbar(): void {
    this._snackbar.open('При обновлении Продукт произошла ошибка', null, {duration: 3500});
  }
}
