import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'signup',
        loadChildren: () => import('./features/sign-up/sign-up.routes').then(m => m.route)
    },
    {
        path: 'login',
        loadChildren: () => import('./features/login/login.routes').then(m => m.route)
    }
];
