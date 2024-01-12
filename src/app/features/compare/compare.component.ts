import {
  getUserConfiguration,
  resetConfiguration,
} from './../../store/admin/products/categories.actions';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BasicConfig, ProductItem } from '../../types';
import { CommonModule } from '@angular/common';
import { Observable, concatMap } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectConfigurationState } from '../../store/admin/products/configuration.reducers';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compare.component.html',
})
export class CompareComponent implements OnInit, OnDestroy {
  firstProduct!: ProductItem;
  secondProduct!: ProductItem;
  productAttr!: Observable<BasicConfig[]>;
  constructor(private router: Router, private store: Store) {}
  ngOnInit(): void {
    const lastNavigation = this.router.lastSuccessfulNavigation;
    if (lastNavigation && lastNavigation.extras.state) {
      this.firstProduct = lastNavigation.extras.state['firstProduct'];
      this.secondProduct = lastNavigation.extras.state['secondProduct'];

      this.store.dispatch(getUserConfiguration({id: this.firstProduct.category.id, name: this.firstProduct.category.name }))
      this.store.dispatch(getUserConfiguration({id: this.secondProduct.category.id, name: this.secondProduct.category.name }))
      
      this.productAttr = this.store.select(selectConfigurationState)
    } else {
      this.clearSelections()
    }
  }
  ngOnDestroy(): void {    
    this.store.dispatch(resetConfiguration());
  }

  clearSelections() {
    this.router.navigateByUrl('/servers', { replaceUrl: true })
  }

  navigateToConfigure(id: string) {
    this.router.navigateByUrl(`/product/configure/${id}`)
  }
}
