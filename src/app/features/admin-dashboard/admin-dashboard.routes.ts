import { ProductsEffect } from './../../store/admin/products/products.effects';
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
import { productsFeature } from '../../store/admin/products/products.reducers';
import { configurationFeature } from '../../store/admin/products/configuration.reducers';
import { CategoryManagementComponent } from './features/category-management/category-management.component';
import { AttributesComponent } from './features/attributes/attributes.component';
import { AddCategoryComponent } from './features/add-category/add-category.component';
import { AttributeEffect } from '../../store/category-management/attributes/attributes.effects';
import { attributeCreationFeature, attributesFeature } from '../../store/category-management/attributes/attributes.reducers';
import { ConfigEffect } from '../../store/category-management/attributes/config/config.effects';
import { configFeature, editConfigFeature } from '../../store/category-management/attributes/config/config.reducers';

export const route: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    providers: [
      provideEffects(AttributeEffect),
      provideState(attributesFeature)
    ],
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
        path: 'add-category',
        component: AddCategoryComponent,
        providers: [
          provideEffects(ConfigEffect)
        ]
      },
      {
        path: 'add-category/:id',
        component: AddCategoryComponent,
        providers: [
          provideEffects(ConfigEffect),
          provideState(editConfigFeature)
        ]
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'category-management',
        component: CategoryManagementComponent,
        providers: [
          provideEffects(ConfigEffect),
          provideState(configFeature),
        ]
      },
      {
        path: 'attributes',
        component: AttributesComponent,
        providers: [
          provideEffects(AttributeEffect),
          provideState(attributeCreationFeature),
          provideState(attributesFeature)
        ]
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
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.route),
      }
    ],
  },
];
