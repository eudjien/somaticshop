import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-overlay-loader',
  templateUrl: './overlay-loader.component.html',
  styleUrls: ['./overlay-loader.component.scss']
})
export class OverlayLoaderComponent implements OnInit {

  @Input()
  isLoading = false;
  @Input()
  loadingMessage = '';
  @Input()
  overlayStyles = {};
  @Input()
  hideContentWhenLoading = false;
  @Input()
  disableSpinner = false;

  constructor() {
  }

  ngOnInit() {
  }
}
