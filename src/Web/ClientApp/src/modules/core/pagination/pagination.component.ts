import {Component, EventEmitter, HostBinding, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PaginationComponent implements OnInit {

  @Input() totalItems = 0;

  @Input() _pageSize = 10;
  @Output() pageSizeChange: EventEmitter<number> = new EventEmitter<number>();

  @Input() pageIndex = 0;
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();

  private pageSizesArray: number[] = [];

  get pageSize(): number {
    return this._pageSize;
  }

  @Input() set pageSize(size: number) {
    if (size && size > 0) {
      this._pageSize = size;
      if (!this.pageSizesArray.includes(size)) {
        this.pageSizesArray.push(size);
        this.pageSizesArray = this.pageSizesArray.sort((a, b) => a - b);
      }
    }
  }

  @Input()
  set pageSizes(sizes: number[]) {
    const sizeArray = [...new Set((sizes || []).filter(a => a > 0))];
    if (!sizeArray.includes(this._pageSize)) {
      sizeArray.push(this._pageSize);
    }
    this.pageSizesArray = sizeArray.sort((a, b) => a - b);
  }

  get pageSizes(): number[] {
    return [...new Set(this.pageSizesArray.concat(this.pageSizesArray))];
  }

  @HostBinding('class.pagination-host')
  paginationHost = true;

  constructor() {
  }

  pageSizeChangeEvent(pageSize: number): void {
    console.log('new page size: ' + pageSize);
    this.pageSizeChange.emit(pageSize);
  }

  get totalPages(): number {
    return Math.trunc(Math.ceil(this.totalItems / this.pageSize));
  }

  get firstPageIsActive(): boolean {
    return this.pageIndex === 0;
  }

  get lastPageIsActive(): boolean {
    return this.pageIndex === (this.totalPages - 1);
  }

  get pages(): number[] {
    return Array<number>(this.totalPages).fill(0).map((a, i) => i);
  }

  ngOnInit(): void {
  }

  firstClick(): void {
    this.pageIndex = 0;
    this.pageIndexChange.emit(this.pageIndex);
  }

  lastClick(): void {
    this.pageIndex = this.totalPages - 1;
    this.pageIndexChange.emit(this.pageIndex);
  }

  prevClick(): void {
    this.pageIndex = this.pageIndex - 1;
    this.pageIndexChange.emit(this.pageIndex);
  }

  nextClick(): void {
    this.pageIndex = this.pageIndex + 1;
    this.pageIndexChange.emit(this.pageIndex);
  }

  isActivePage(pageIndex: number): boolean {
    return pageIndex === this.pageIndex;
  }
}
