import {Component, OnInit} from '@angular/core';
import {MediaObserver} from '@angular/flex-layout';

@Component({
  selector: 'app-breakpoint-text',
  template: '{{breakpoint}}'
})
export class BreakpointTextComponent implements OnInit {

  breakpoint: string;

  constructor(private _mediaObserver: MediaObserver) {
    _mediaObserver.asObservable().subscribe(change => {
      this.breakpoint = change[0].mqAlias;
    });
  }

  get breakPoint(): string {
    return this.breakpoint;
  }

  ngOnInit(): void {
  }
}
