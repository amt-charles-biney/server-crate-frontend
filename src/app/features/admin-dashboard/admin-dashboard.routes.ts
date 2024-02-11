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
import { configFeature, editConfigFeature } from '../../store/category-management/attributes/config/config.reducers';
import { AddCategoryComponent } from './features/add-category/add-category.component';


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
    ],
  },
];
