import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

export interface IFile {
  data: string;
  file: File;
}

@Component({
  selector: 'app-upload-image-multi-delete-dialog',
  templateUrl: 'upload-image-multi-delete-dialog.component.html',
})
export class UploadImageMultiDeleteDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<UploadImageMultiDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number) {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }
}
