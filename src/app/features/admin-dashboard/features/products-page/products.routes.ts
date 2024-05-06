import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./products-page.component').then(m => m.ProductsPageComponent),
    },
    {
        path: 'add-product',
        loadComponent: () => import('../add-product/add-product.component').then(m => m.AddProductComponent),
      },
      {
        path: 'add-product/:id',
        loadComponent: () => import('../add-product/add-product.component').then(m => m.AddProductComponent),
      },
]