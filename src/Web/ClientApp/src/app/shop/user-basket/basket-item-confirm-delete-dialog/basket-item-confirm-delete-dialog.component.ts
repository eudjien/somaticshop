import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-basket-item-confirm-delete-dialog',
  templateUrl: './basket-item-confirm-delete-dialog.component.html',
  styleUrls: ['./basket-item-confirm-delete-dialog.component.scss']
})
export class BasketItemConfirmDeleteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit(): void {
  }

}
