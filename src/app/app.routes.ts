import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { loginFeature } from './store/signin/reducers/login.reducers';
import { LoginEffect } from './store/signin/effects/login.effects';
import { signUpFeature } from './store/signup/reducers/signup.reducers';
import { SignUpEffect } from './store/signup/effects/signup.effects';

export const routes: Routes = [
    {
        path: 'signup',
        loadComponent: () => import('./features/sign-up/sign-up.component').then(m => m.SignUpComponent),
        providers: [
            provideState(signUpFeature),
            provideEffects(SignUpEffect),
        ],
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        providers: [
            provideState(loginFeature),
            provideEffects(LoginEffect)
        ]
    },
];
