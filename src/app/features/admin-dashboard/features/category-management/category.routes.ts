import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./category-management.component').then(m => m.CategoryManagementComponent),
    },
    {
        path: 'add-category',
        loadComponent: () => import('../add-category/add-category.component').then(m => m.AddCategoryComponent),
    },
    {
        path: 'add-category/:id',
        loadComponent: () => import('../add-category/add-category.component').then(m => m.AddCategoryComponent),
    },
]