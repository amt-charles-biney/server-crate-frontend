import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    {
        path: 'signup',
        loadChildren: () => import('./features/sign-up/sign-up.routes').then(m => m.route)
    },
    {
        path: 'login',
        loadChildren: () => import('./features/login/login.routes').then(m => m.route)
    },
    {
        path: 'forgot-password',
        loadChildren: () => import('./features/reset/reset.routes').then(m => m.route)
    },
    {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then(m => m.route)
    }
];
