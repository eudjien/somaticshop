import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {UploadImageSingleComponent} from '../upload-image-single/upload-image-single.component';
import {Catalog} from '../../../models/catalog/Catalog';
import {CatalogService} from '../../../services/catalog.service';
import {SelectCatalogForCatalogComponent} from '../selects/select-catalog-for-catalog/select-catalog-for-catalog.component';

@Component({
  selector: 'app-catalog-new',
  templateUrl: './catalog-edit.component.html',
  styleUrls: ['./catalog-edit.component.scss']
})
export class CatalogNewComponent implements OnInit {

  isLoading = false;

  title = new FormControl('', [Validators.required]);

  @ViewChild('uploadImage')
  uploadImage: UploadImageSingleComponent;
  @ViewChild('selectCatalogForCatalog')
  selectCatalogForCatalog: SelectCatalogForCatalogComponent;

  constructor(
    private _catalogService: CatalogService,
    private _snackbar: MatSnackBar,
    private _router: Router) {
  }

  ngOnInit(): void {
  }

  sendClick() {
    const catalog: Catalog = {
      id: 0,
      title: this.title.value,
      parentCatalogId: this.selectCatalogForCatalog.selected?.id
    };
    this.sendData(catalog, this.uploadImage.images.map(a => a.file)[0]);
  }

  private sendData(catalog: Catalog, imageFile: File) {
    this.isLoading = true;
    this._catalogService.createCatalog(catalog, imageFile).subscribe(newCatalog => {
      this._router.navigateByUrl(`mgmt/catalogs/${newCatalog.id}/edit`).catch();
      this._snackbar.open('Каталог успешно создан!', null, {duration: 3000});
    }, error => {

    }).add(() => this.isLoading = false);
  }
}
