import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { loginFeature } from './store/signin/reducers/login.reducers';
import { LoginEffect } from './store/signin/effects/login.effects';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        providers: [
            provideState(loginFeature),
            provideEffects(LoginEffect)
        ]
    },
];
