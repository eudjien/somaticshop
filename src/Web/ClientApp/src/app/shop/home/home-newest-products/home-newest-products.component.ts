import {Component, OnInit} from '@angular/core';
import {ProductCard} from '../../../../viewModels/ProductCard';
import {AppConstants} from '../../../../app-constants';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-home-newest-products',
  templateUrl: './home-newest-products.component.html',
  styleUrls: ['./home-newest-products.component.scss']
})
export class HomeNewestProductsComponent implements OnInit {

  viewModels: ProductCard[];

  constructor(private _route: ActivatedRoute, private _router: Router) {
  }

  get currency(): string {
    return AppConstants.CURRENCY;
  }

  ngOnInit(): void {
    this.viewModels = this._route.snapshot.data.newestProducts as ProductCard[];
  }
}
