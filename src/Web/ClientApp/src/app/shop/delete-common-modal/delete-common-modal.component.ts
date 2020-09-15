import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-delete-common-modal',
  templateUrl: './delete-common-modal.component.html',
  styleUrls: ['./delete-common-modal.component.scss']
})
export class DeleteCommonModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteCommonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public message: string[]) {
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onOkClick(): void {
    this.dialogRef.close(true);
  }

  ngOnInit(): void {
  }
}
