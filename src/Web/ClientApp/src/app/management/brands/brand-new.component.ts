import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Brand} from '../../../models/Brand';
import {BrandService} from '../../../services/brand.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';
import {EditorComponent} from '../editor/editor.component';
import {UploadImageSingleComponent} from '../upload-image-single/upload-image-single.component';

@Component({
  selector: 'app-brand-new',
  templateUrl: './brand-edit.component.html',
  styleUrls: ['./brand-edit.component.scss']
})
export class BrandNewComponent implements OnInit {

  isLoading = false;

  name = new FormControl('', [Validators.required]);

  @ViewChild('editor')
  editor: EditorComponent;
  @ViewChild('uploadImage')
  uploadImage: UploadImageSingleComponent;

  constructor(
    private _brandService: BrandService,
    private _snackbar: MatSnackBar,
    private _router: Router) {
  }

  ngOnInit(): void {
  }

  sendClick() {
    const brand: Brand = {
      id: 0,
      name: this.name.value,
      content: JSON.stringify(this.editor.getContents().ops),
    };
    this.sendData(brand, this.uploadImage.images.map(a => a.file)[0]);
  }

  private sendData(brand: Brand, imageFile: File) {
    this.isLoading = true;
    this._brandService.createBrand(brand, imageFile).subscribe(newBrand => {
      this._router.navigateByUrl(`mgmt/brands/${newBrand.id}/edit`).catch();
      this._snackbar.open('Бренд успешно создан!', null, {duration: 3000});
    }, error => {

    }).add(() => {
      this.isLoading = false;
    });
  }
}
