import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./case-management.component').then(m => m.CaseManagementComponent),
    },
    {
        path: 'add-case',
        loadComponent: () => import('./features/add-case/add-case.component').then(m => m.AddCaseComponent),
    },
    {
        path: 'add-case/:id',
        loadComponent: () => import('./features/add-case/add-case.component').then(m => m.AddCaseComponent),
    }
]