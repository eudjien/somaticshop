import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UploadImageSingleDeleteDialogComponent} from './upload-image-single-delete-dialog/upload-image-single-delete-dialog.component';

export interface IFile {
  data: string;
  file: File;
}

@Component({
  selector: 'app-upload-image-single',
  templateUrl: './upload-image-single.component.html',
  styleUrls: ['./upload-image-single.component.scss']
})
export class UploadImageSingleComponent implements OnInit {

  fileAddSubject: Subject<File> = new Subject<File>();

  @Input()
  images: IFile[] = [];

  displayedColumns: string[] = ['data', 'fileName', 'contentType', 'size'];
  dataSource = new MatTableDataSource<IFile>(this.images);

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar) {
  }

  onFileSelect(event) {
    const files = <FileList>event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.fileAddSubject.next(file);
    }
    event.target.value = '';
  }

  addClick(input: HTMLInputElement) {
    input.click();
  }

  ngOnInit(): void {
    this.fileAddSubject.subscribe((file: File) => {

      const dataFile = <IFile>{
        data: null,
        file: file,
      };

      this.images.push(dataFile);
      this.dataSource.data = this.images;

      this.blobToDataUrl(dataFile);
    });
  }

  blobToDataUrl(dataFile: IFile) {
    const fileReader = new FileReader();
    fileReader.onloadend = (ev: ProgressEvent<FileReader>) => {
      const dataUrl: string = <string>ev.target.result;

      const f: IFile = this.images[this.images.indexOf(dataFile)];
      f.data = dataUrl;

    };
    fileReader.readAsDataURL(dataFile.file);
  }

  onDeleteClick(): void {
    this.openDialog();
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(UploadImageSingleDeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSelected();
        this.snackBar.open('Изображение успешно удалено', null, {
          duration: 3500,
          verticalPosition: 'bottom',
        });
      }
    });
  }

  deleteSelected(): void {
    this.images = [];
    this.dataSource.data = this.images;
  }
}
