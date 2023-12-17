import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { SignUpEffect } from './store/signup/effects/signup.effects';
import { signUpFeature } from './store/signup/reducers/signup.reducers';
import { provideState } from '@ngrx/store';
import { VerifyEffect } from './store/signup/effects/verify.effects';
import { loginFeature } from './store/signin/reducers/login.reducers';
import { LoginEffect } from './store/signin/effects/login.effects';

export const routes: Routes = [
    {
        path: 'signup',
        loadChildren: () => import('./features/sign-up/sign-up.routes').then(m => m.route),
    },
    {
        path: 'otp',
        loadChildren: () => import('./features/otpsignup/otpsignup.routes').then(m => m.route),
        providers: [
            provideEffects(VerifyEffect)
        ]
    },
    {
        path: 'login',
        loadChildren: () => import('./features/login/login.routes').then(m => m.route),
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
