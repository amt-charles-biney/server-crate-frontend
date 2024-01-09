import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasicConfig, ProductItem } from '../../types';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { getConfiguration } from '../../store/admin/products/categories.actions';
import { selectConfigurationState } from '../../store/admin/products/configuration.reducers';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare.component.html',
})
export class CompareComponent implements OnInit {
  firstProduct!: ProductItem
  secondProduct!: ProductItem
  firstProductAttr!: Observable<BasicConfig>
  secondProductAttr!: Observable<any>
  constructor(private router: Router, private store: Store) {}
  ngOnInit(): void {
    const lastNavigation = this.router.lastSuccessfulNavigation
    if (lastNavigation && lastNavigation.extras.state) {
      this.firstProduct = lastNavigation.extras.state['firstProduct']
      this.secondProduct = lastNavigation.extras.state['secondProduct']
      
      
    } else {
      console.log('');
    }
  }
}
