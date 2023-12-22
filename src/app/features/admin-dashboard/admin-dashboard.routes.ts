import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { ProductsPageComponent } from './features/products-page/products-page.component';
import { AddProductComponent } from './features/add-product/add-product.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { OrdersComponent } from './features/orders/orders.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { CustomersComponent } from './features/customers/customers.component';
import { SettingsComponent } from './features/settings/settings.component';
import { provideEffects } from '@ngrx/effects';
import { CategoryEffect } from '../../store/admin/products/categories.effect';
import { provideState } from '@ngrx/store';
import { categoryFeature } from '../../store/admin/products/categories.reducers';

export const route: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    children: [
      {
        path: 'products',
        component: ProductsPageComponent,
      },
      {
        path: 'add-product',
        component: AddProductComponent,
        providers: [
          provideEffects(CategoryEffect),
          provideState(categoryFeature)
        ]
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'orders',
        component: OrdersComponent
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'customers',
        component: CustomersComponent
      },
      {
        path: 'settings',
        component: SettingsComponent
      }
    ],
  },
];
