import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';
import {map} from 'rxjs/operators';

export const VIEW_LIST_MODE = 'list';
export const VIEW_CARD_MODE = 'card';
export const VIEW_LIST_MODE_ICON = 'view_list';
export const VIEW_CARD_MODE_ICON = 'view_module';

@Component({
  selector: 'app-layout-mode-header',
  templateUrl: './layout-mode-header.component.html',
  styleUrls: ['./layout-mode-header.component.scss']
})
export class LayoutModeHeaderComponent implements OnInit {

  @Input()
  layoutMode: 'list' | 'card' = VIEW_LIST_MODE;

  @Output()
  modeChange: EventEmitter<'list' | 'card'> = new EventEmitter<'list' | 'card'>();

  isLessThanMd$ = this._mediaObserver.asObservable().pipe(map(a => a[1].mqAlias === 'lt-md'));

  constructor(private _mediaObserver: MediaObserver) {
  }

  get viewCardIcon(): string {
    return VIEW_CARD_MODE_ICON;
  }

  get viewListIcon(): string {
    return VIEW_LIST_MODE_ICON;
  }

  get cardModeEnabled(): boolean {
    return this.layoutMode === VIEW_CARD_MODE;
  }

  get listModeEnabled(): boolean {
    return this.layoutMode === VIEW_LIST_MODE;
  }

  get activeModeIcon(): string {
    return this.listModeEnabled ? VIEW_LIST_MODE_ICON : VIEW_CARD_MODE_ICON;
  }

  ngOnInit(): void {
  }

  enableCardViewMode(): void {
    this.modeChange.emit(this.layoutMode = VIEW_CARD_MODE);
  }

  enableListViewMode(): void {
    this.modeChange.emit(this.layoutMode = VIEW_LIST_MODE);
  }
}
