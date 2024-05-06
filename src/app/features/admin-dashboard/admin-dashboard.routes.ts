import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CategoryEffect } from '../../store/admin/products/categories/categories.effect';
import { categoryFeature } from '../../store/admin/products/categories/categories.reducers';
import { configurationFeature } from '../../store/admin/products/configuration.reducers';
import { AttributesComponent } from './features/attributes/attributes.component';
import { AttributeEffect } from '../../store/category-management/attributes/attributes.effects';
import {
  attributeCreationFeature,
  attributesFeature,
} from '../../store/category-management/attributes/attributes.reducers';
import { ConfigEffect } from '../../store/category-management/attributes/config/config.effects';
import {
  categoryImageFeature,
  configFeature,
  editConfigFeature,
} from '../../store/category-management/attributes/config/config.reducers';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { CustomersComponent } from './features/customers/customers.component';
import { CaseEffect } from '../../store/case/case.effects';
import { caseFeature } from '../../store/case/case.reducers';
import { authGuard } from '../../core/guards/auth.guard';
import { OrderEffects } from '../../store/orders/order.effects';
import { orderFeature } from '../../store/orders/order.reducers';
import { OrdersOutletComponent } from './features/orders/orders-outlet.component';
import { CustomerEffect } from '../../store/customers/customers.effects';
import { customerFeature } from '../../store/customers/customers.reducers';
import { DashboardEffect } from '../../store/dashboard/dashboard.effects';
import { dashboardFeature } from '../../store/dashboard/dashboard.reducers';
import { ProductsOutlet } from './features/products-page/products-outlet.component';
import { CasesOutletComponent } from './features/case-management/cases-outlet.component';

export const route: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    providers: [
      provideEffects(AttributeEffect),
      provideEffects(CaseEffect),
      provideState(attributesFeature),
      provideState(attributeCreationFeature),
      provideState(caseFeature),
    ],
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'products',
        component: ProductsOutlet,
        providers: [
          provideEffects(CategoryEffect),
          provideState(categoryFeature),
          provideState(configurationFeature),
        ],
        loadChildren: () =>
          import('./features/products-page/products.routes').then(
            (m) => m.routes
          ),
      },
      {
        path: 'cases',
        component: CasesOutletComponent,
        providers: [provideEffects(CaseEffect), provideState(caseFeature)],
        loadChildren: () =>
          import('./features/case-management/cases.routes').then(
            (m) => m.routes
          ),
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        providers: [
          provideEffects(DashboardEffect),
          provideState(dashboardFeature),
        ],
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'categories',
        providers: [
          provideEffects(ConfigEffect),
          provideState(configFeature),
          provideState(editConfigFeature),
          provideState(categoryImageFeature),
        ],
        loadChildren: () =>
          import('./features/category-management/category.routes').then(
            (m) => m.routes
          ),
      },
      {
        path: 'attributes',
        component: AttributesComponent,
      },
      {
        path: 'orders',
        component: OrdersOutletComponent,
        providers: [provideEffects(OrderEffects), provideState(orderFeature)],
        loadChildren: () =>
          import('./features/orders/orders.routes').then((m) => m.routes),
      },
      {
        path: 'transactions',
        component: TransactionsComponent,
      },
      {
        path: 'customers',
        component: CustomersComponent,
        providers: [
          provideEffects(CustomerEffect),
          provideState(customerFeature),
        ],
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.route),
      },
    ],
  },
];
