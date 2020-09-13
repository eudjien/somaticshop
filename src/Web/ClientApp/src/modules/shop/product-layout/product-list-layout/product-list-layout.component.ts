import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from '@angular/animations';
import {ProductCard} from '../../../../viewModels/ProductCard';

@Component({
  selector: 'app-product-list-layout',
  templateUrl: './product-list-layout.component.html',
  styleUrls: ['./product-list-layout.component.scss'],
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
export class ProductListLayoutComponent implements OnInit {

  @Input()
  items: ProductCard[];

  constructor() {
  }

  @HostBinding('@stagger') get stagger() {
    return this.items;
  }

  ngOnInit(): void {
  }
}
