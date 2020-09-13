import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Brand} from '../../../../models/Brand';
import {BrandService} from '../../../../services/brand.service';
import {Page} from '../../../../models/Page';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router} from '@angular/router';
import {SelectionModel} from '@angular/cdk/collections';
import {Sort} from '@angular/material/sort';
import {DeleteCommonModalComponent} from '../../../shop/delete-common-modal/delete-common-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'app-brands',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit, AfterViewInit {

  @ViewChild('paginator')
  paginator: MatPaginator;

  isLoading = false;
  page: Page<Brand>;

  sortTitle = '';
  searchTitle = '';

  searchSubject: Subject<string> = new Subject<string>().pipe(debounceTime(500)) as Subject<string>;

  selection = new SelectionModel<Brand>(true, []);

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _brandService: BrandService,
    public _dialog: MatDialog,
    public _snackBar: MatSnackBar) {
    this.searchSubject.subscribe(value => {
      this.searchTitle = value;
      this.loadPage(this.page.pageIndex);
    });
  }

  ngOnInit(): void {
    this.loadPage(1);
  }

  ngAfterViewInit(): void {
  }

  hasPageItems(): boolean {
    return !!this.page?.items?.length;
  }

  paginationChange(pageEvent: PageEvent) {
    this.loadPage(pageEvent.pageIndex + 1);
  }

  sortChange(sort: Sort) {
    if (sort.active === 'title') {
      this.sortTitle = sort.direction === '' ? null : sort.direction;
      this.loadPage(this.page.pageIndex);
    }
  }

  deleteClick($event: MouseEvent) {
    this.openDeleteDialog();
  }

  openDeleteDialog(): void {
    const isOne = this.selection.selected.length === 1;
    const dialogRef = this._dialog.open(DeleteCommonModalComponent, {
      data: `Удалить ${isOne ? `бренд '${this.selection.selected[0].name}'` : `бренды (${this.selection.selected.length})`}?`
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteSelected();
      }
    });
  }

  deleteSelected(): void {
    this.isLoading = true;
    const ids = this.selection.selected.map(a => a.id);
    this._brandService.deleteBrands(ids).subscribe(() => {
      this.showDeleteSuccessSnackbar();
      this.selection.clear();
      this.loadPage(this.page.pageIndex);
    }).add(() => this.isLoading = false);
  }

  showDeleteSuccessSnackbar() {
    this._snackBar.open('Удаление успешно выполнено!', null, {
      duration: 3500,
      verticalPosition: 'bottom',
    });
  }

  searchChange($event: any) {
    this.searchSubject.next($event);
  }

  selectChange(checked: boolean, brand: Brand): void {
    if (checked) {
      this.selection.select(brand);
    } else {
      this.selection.deselect(this.selection.selected.find(a => a.id === brand.id));
    }
  }

  pageSelectChange(checked: boolean): void {
    if (checked) {
      this.selection.select(...this.page.items.filter(a => !this.selection.selected.some(b => b.id === a.id)));
    } else {
      this.selection.deselect(...this.selection.selected.filter(a => this.page.items.some(b => b.id === a.id)));
    }
  }

  someOnPageSelected(): boolean {
    return this.page && this.page.items.some(a => this.selection.selected.some(b => b.id === a.id)) && !this.isAllOnPageSelected();
  }

  isAllOnPageSelected(): boolean {
    return this.page && this.page.items.every(a => this.selection.selected.some(b => b.id === a.id));
  }

  isSelected(brand: Brand): boolean {
    return this.selection.selected.some(a => a.id === brand.id);
  }

  private loadPage(page: number): void {
    this.isLoading = true;

    this._brandService.getBrandsPage(page, this.sortTitle, this.searchTitle)
      .subscribe((brandPage: Page<Brand>) => {
        this.page = brandPage;
        this.initPaginator(brandPage);
      }).add(() => this.isLoading = false);
  }

  private initPaginator(page: Page<any>): void {
    this.paginator.length = page.totalItems;
    this.paginator.pageIndex = page.pageIndex - 1;
  }
}
