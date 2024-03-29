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
import { AttributesComponent } from './features/attributes/attributes.component';
import { AttributeEffect } from '../../store/category-management/attributes/attributes.effects';
import { attributeCreationFeature, attributesFeature } from '../../store/category-management/attributes/attributes.reducers';
import { CategoryManagementComponent } from './features/category-management/category-management.component';
import { ConfigEffect } from '../../store/category-management/attributes/config/config.effects';
import { categoryImageFeature, configFeature, editConfigFeature } from '../../store/category-management/attributes/config/config.reducers';
import { AddCategoryComponent } from './features/add-category/add-category.component';
import { TransactionsComponent } from './features/transactions/transactions.component';
import { CustomersComponent } from './features/customers/customers.component';
import { OrdersComponent } from './features/orders/orders.component';
import { CaseManagementComponent } from './features/case-management/case-management.component';
import { CaseEffect } from '../../store/case/case.effects';
import { caseFeature } from '../../store/case/case.reducers';
import { authGuard } from '../../core/guards/auth.guard';
import { AddCaseComponent } from './features/case-management/features/add-case/add-case.component';
import { OrderEffects } from '../../store/orders/order.effects';
import { orderFeature } from '../../store/orders/order.reducers';
import { OrdersOutletComponent } from './features/orders/orders-outlet.component';
import { CustomerEffect } from '../../store/customers/customers.effects';
import { customerFeature } from '../../store/customers/customers.reducers';
import { DashboardEffect } from '../../store/dashboard/dashboard.effects';
import { dashboardFeature } from '../../store/dashboard/dashboard.reducers';


export const route: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    providers: [
      provideEffects(AttributeEffect),
      provideState(attributesFeature),
      provideEffects(CaseEffect),
      provideState(caseFeature)
    ],
    canActivate: [authGuard],
    canActivateChild: [authGuard],
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
        path: 'case-management',
        component: CaseManagementComponent
      },
      {
        path: 'add-case',
        component: AddCaseComponent,
        providers: [
          provideEffects(CaseEffect),
          provideState(caseFeature)
        ]
      },
      {
        path: 'add-case/:id',
        component: AddCaseComponent,
        providers: [
          provideEffects(CaseEffect),
          provideState(caseFeature)
        ]
      },
      {
        path: 'add-product',
        component: AddProductComponent,
        providers: [
          provideEffects(CategoryEffect),
          provideState(categoryFeature),
          provideState(configurationFeature),
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
          provideEffects(ConfigEffect),
          provideState(categoryImageFeature)
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
        component: DashboardComponent,
        providers: [
          provideEffects(DashboardEffect),
          provideState(dashboardFeature)
        ],
        data: {
          title: 'Dashboard'
        }
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
        component: OrdersOutletComponent,
        providers: [
          provideEffects(OrderEffects),
          provideState(orderFeature)
        ],
        loadChildren: () => import('./features/orders/orders.routes').then(m => m.routes)
      },
      {
        path: 'transactions',
        component: TransactionsComponent
      },
      {
        path: 'customers',
        component: CustomersComponent,
        providers: [
          provideEffects(CustomerEffect),
          provideState(customerFeature)
        ]
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.route),
      }
    ],
  },
];
