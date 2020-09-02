import {Component, Input, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UploadImageMultiDeleteDialogComponent} from './upload-image-multi-delete-dialog/upload-image-multi-delete-dialog.component';

export interface IFile {
  data: string;
  file: File;
}

@Component({
  selector: 'app-upload-image-multi',
  templateUrl: './upload-image-multi.component.html',
  styleUrls: ['./upload-image-multi.component.scss']
})
export class UploadImageMultiComponent implements OnInit {

  fileAddSubject: Subject<File> = new Subject<File>();

  @Input()
  images: IFile[] = [];

  displayedColumns: string[] = ['data', 'fileName', 'contentType', 'size', 'select'];
  dataSource = new MatTableDataSource<IFile>(this.images);
  selection = new SelectionModel<IFile>(true, []);

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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  checkboxLabel(row?: IFile): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${this.dataSource.data.indexOf(row)}`;
  }

  onDeleteClick(): void {
    this.openDialog();
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(UploadImageMultiDeleteDialogComponent, {
      data: this.selection.selected.length
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSelected();
        this.snackBar.open('Изображения успешно удалены', null, {
          duration: 3500,
          verticalPosition: 'bottom',
        });
      }
    });
  }

  deleteSelected(): void {
    this.selection.selected.forEach(f => {
      this.images.splice(this.images.indexOf(f), 1);
    });
    this.dataSource.data = this.images;
    this.selection.clear();
  }
}
