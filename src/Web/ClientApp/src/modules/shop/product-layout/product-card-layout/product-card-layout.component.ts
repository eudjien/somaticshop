import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {AppConstants} from '../../../../app-constants';
import {ProductCard} from '../../../../viewModels/ProductCard';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-product-card-layout',
  templateUrl: './product-card-layout.component.html',
  styleUrls: ['./product-card-layout.component.scss'],
  animations: [
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
            style({
              opacity: 0,
              transform: 'scale(0.95)',
            }),
            stagger(90, [animate('300ms', style({opacity: 1, transform: 'none'}))])
          ], {optional: true}
        )
      ])
    ]),
  ],
})
export class ProductCardLayoutComponent implements OnInit {

  @Input()
  cardSize = 5;

  @Input()
  items: ProductCard[];

  constructor() {
  }

  @HostBinding('@stagger') get stagger() {
    return this.items;
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
  }
}
