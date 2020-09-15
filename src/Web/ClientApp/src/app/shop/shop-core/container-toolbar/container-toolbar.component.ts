import {Component, HostBinding, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-container-toolbar',
  templateUrl: './container-toolbar.component.html',
  styleUrls: ['./container-toolbar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ContainerToolbarComponent implements OnInit {

  @HostBinding('class.container-toolbar')
  containerToolbarClass = true;

  constructor() {
  }

  ngOnInit(): void {
  }
}
