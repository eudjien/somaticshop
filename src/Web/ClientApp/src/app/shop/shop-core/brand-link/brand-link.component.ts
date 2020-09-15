import {Component, Input, OnInit} from '@angular/core';
import {BrandCard} from '../../../../viewModels/BrandCard';

@Component({
  selector: 'app-brand-link',
  templateUrl: './brand-link.component.html',
  styleUrls: ['./brand-link.component.scss']
})
export class BrandLinkComponent implements OnInit {

  @Input()
  card: BrandCard;

  constructor() {
  }

  ngOnInit(): void {
  }
}
