import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { SignUpEffect } from './store/signup/effects/signup.effects';
import { signUpFeature } from './store/signup/reducers/signup.reducers';
import { provideState } from '@ngrx/store';
import { VerifyEffect } from './store/signup/effects/verify.effects';
import { loginFeature } from './store/signin/reducers/login.reducers';
import { LoginEffect } from './store/signin/effects/login.effects';
import { ResetEffect } from './store/reset/effects/reset.effects';
import { otpFeature } from './store/otp/otp.reducers';

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
            provideEffects(VerifyEffect)
        ]
    },
    {
        path: 'login',
        loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent),
        providers: [
            provideState(loginFeature),
            provideEffects(LoginEffect)
        ]
    },
    {
        path: 'forgot-password',
        loadChildren: () => import('./features/reset/reset.routes').then(m => m.route),
        providers: [
            provideEffects(ResetEffect),
            provideState(otpFeature)
        ]
    },
    {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then(m => m.route)
    }
];
