import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { signUpFeature } from './store/signup/reducers/signup.reducers';
import { SignUpEffect } from './store/signup/effects/signup.effects';
import { VerifyEffect } from './store/signup/effects/verify.effects';

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
        path: 'otp',
        loadChildren: () => import('./features/otpsignup/otpsignup.routes').then(m => m.route),
        providers: [
            provideEffects(VerifyEffect),
        ]
    },
    {
        path: 'login',
        loadChildren: () => import('./features/login/login.routes').then(m => m.route)
    },
    {
        path: 'forgot-password',
        loadChildren: () => import('./features/reset/reset.routes').then(m => m.route)
    }
];
