import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() pageIndex = 0;
  @Output() pageIndexChange: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
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

  numberClick(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.pageIndexChange.emit(pageIndex);
  }

  prevClick(): void {
    this.pageIndex = this.pageIndex - 1;
    this.pageIndexChange.emit(this.pageIndex);
  }

  nextClick(): void {
    this.pageIndex = this.pageIndex + 1;
    this.pageIndexChange.emit(this.pageIndex);
  }

  get pages(): number[] {
    return Array<number>(this.totalPages).fill(0).map((a, i) => i);
  }

  isActivePage(pageIndex: number): boolean {
    return pageIndex === this.pageIndex;
  }
}
