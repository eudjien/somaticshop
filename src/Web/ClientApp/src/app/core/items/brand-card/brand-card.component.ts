import {Component, Input, OnInit} from '@angular/core';
import {BrandDetailsViewModel} from '../../../../viewModels/BrandDetailsViewModel';

@Component({
  selector: 'app-brand-card',
  templateUrl: './brand-card.component.html',
  styleUrls: ['./brand-card.component.scss']
})
export class BrandCardComponent implements OnInit {

  @Input()
  brand: BrandDetailsViewModel;

  constructor() {
  }

  ngOnInit(): void {
  }
}
