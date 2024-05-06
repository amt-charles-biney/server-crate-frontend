import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { CategoryEffect } from '../../store/admin/products/categories/categories.effect';
import { categoryFeature } from '../../store/admin/products/categories/categories.reducers';
import { configurationFeature } from '../../store/admin/products/configuration.reducers';
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
import { CaseEffect } from '../../store/case/case.effects';
import { caseFeature } from '../../store/case/case.reducers';
import { authGuard } from '../../core/guards/auth.guard';
import { OrderEffects } from '../../store/orders/order.effects';
import { orderFeature } from '../../store/orders/order.reducers';
import { CustomerEffect } from '../../store/customers/customers.effects';
import { customerFeature } from '../../store/customers/customers.reducers';
import { DashboardEffect } from '../../store/dashboard/dashboard.effects';
import { dashboardFeature } from '../../store/dashboard/dashboard.reducers';
import { NotificationEffect } from '../../store/admin/products/notifications/notifications.effects';
import { notificationFeature } from '../../store/admin/products/notifications/notifications.reducers';

export const route: Routes = [
  {
    path: '',
    loadComponent: () => import('../admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    providers: [
      provideEffects(AttributeEffect),
      provideEffects(CaseEffect),
      provideState(attributesFeature),
      provideState(attributeCreationFeature),
      provideState(caseFeature),
      provideEffects(NotificationEffect),
      provideState(notificationFeature),
    ],
    canActivate: [authGuard],
    canActivateChild: [authGuard],
    children: [
      {
        path: 'products',
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
        providers: [provideEffects(CaseEffect), provideState(caseFeature)],
        loadChildren: () =>
          import('./features/case-management/cases.routes').then(
            (m) => m.routes
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../admin-dashboard/features/dashboard/dashboard.component').then(m => m.DashboardComponent),
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
        loadComponent: () => import('../admin-dashboard/features/attributes/attributes.component').then(m => m.AttributesComponent),
      },
      {
        path: 'orders',
        providers: [provideEffects(OrderEffects), provideState(orderFeature)],
        loadChildren: () =>
          import('./features/orders/orders.routes').then((m) => m.routes),
      },
      {
        path: 'transactions',
        loadComponent: () => import('../admin-dashboard/features/transactions/transactions.component').then(m => m.TransactionsComponent),
      },
      {
        path: 'customers',
        loadComponent: () => import('../admin-dashboard/features/customers/customers.component').then(m => m.CustomersComponent),
        providers: [
          provideEffects(CustomerEffect),
          provideState(customerFeature),
        ],
      },
      {
        path: 'settings',
        loadComponent: () => import('../admin-dashboard/features/settings/settings.component').then(m => m.SettingsComponent),
        loadChildren: () =>
          import('./features/settings/settings.routes').then((m) => m.route),
      },
    ],
  },
];
