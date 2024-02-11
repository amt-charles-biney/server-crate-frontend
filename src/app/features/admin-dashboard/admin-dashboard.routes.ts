import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ProductsPageComponent } from './features/products-page/products-page.component';
import { ProductsEffect } from '../../store/admin/products/products.effects';
import { productsFeature } from '../../store/admin/products/products.reducers';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { AddProductComponent } from './features/add-product/add-product.component';
import { CategoryEffect } from '../../store/admin/products/categories.effect';
import { categoryFeature } from '../../store/admin/products/categories.reducers';
import { configurationFeature } from '../../store/admin/products/configuration.reducers';


export const route: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'products',
        component: ProductsPageComponent,
        providers: [
          provideEffects(ProductsEffect),
          provideState(productsFeature)
        ]
      },
      {
        path: 'add-product',
        component: AddProductComponent,
        providers: [
          provideEffects(CategoryEffect),
          provideState(categoryFeature),
          provideState(configurationFeature)
        ]
      },
      {
        path: 'add-product/:id',
        component: AddProductComponent,
        providers: [
          provideEffects(CategoryEffect),
          provideState(productsFeature),
          provideState(categoryFeature),
          provideState(configurationFeature),
        ]
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
    ],
  },
];
