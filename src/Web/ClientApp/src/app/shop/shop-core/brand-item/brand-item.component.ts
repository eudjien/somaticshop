import {Component, Input, OnInit} from '@angular/core';
import {BrandCard} from '../../../../viewModels/BrandCard';

@Component({
  selector: 'app-brand-item',
  templateUrl: './brand-item.component.html',
  styleUrls: ['./brand-item.component.scss']
})
export class BrandItemComponent implements OnInit {

  @Input()
  card: BrandCard;

  constructor() {
  }

  ngOnInit(): void {
  }

}
