import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { loginFeature } from './store/signin/reducers/login.reducers';
import { LoginEffect } from './store/signin/effects/login.effects';
import { signUpFeature } from './store/signup/reducers/signup.reducers';
import { SignUpEffect } from './store/signup/effects/signup.effects';
import { VerifyEffect } from './store/signup/effects/verify.effects';
import { ResetEffect } from './store/reset/effects/reset.effects';
import { otpFeature } from './store/otp/otp.reducers';
import { settingsGuard } from './core/guards/settings.guard';
import { authGuard } from './core/guards/auth.guard';
import { GeneralInfoEffect } from './store/account-settings/general-info/general-info.effects';
import { adminGuard } from './core/guards/admin.guard';
import {
  productConfigItemFeature,
} from './store/product-spec/product-spec.reducer';
import { ProductSpecEffects } from './store/product-spec/product-spec.effect';
import { CategoryEffect } from './store/admin/products/categories.effect';
import { categoryFeature } from './store/admin/products/categories.reducers';
import { NotificationEffect } from './store/admin/products/notifications.effects';
import { notificationFeature } from './store/admin/products/notifications.reducers';

export const routes: Routes = [
  {
    path: 'signup',
    loadComponent: () =>
      import('./features/sign-up/sign-up.component').then(
        (m) => m.SignUpComponent
      ),
    providers: [provideState(signUpFeature), provideEffects(SignUpEffect)],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin-dashboard/admin-dashboard.routes').then(
        (m) => m.route
      ),
    canActivate: [settingsGuard, adminGuard, authGuard],
    providers: [
      provideEffects(GeneralInfoEffect),
      provideEffects(NotificationEffect),
      provideState(notificationFeature),
    ],
  },
  {
    path: 'otp',
    loadChildren: () =>
      import('./features/otpsignup/otpsignup.routes').then((m) => m.route),
    providers: [provideEffects(VerifyEffect)],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then((m) => m.LoginComponent),
    providers: [provideState(loginFeature), provideEffects(LoginEffect)],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./features/reset/reset.routes').then((m) => m.route),
    providers: [provideEffects(ResetEffect), provideState(otpFeature)],
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/home/home.routes').then((m) => m.route),
    providers: [
      provideState(categoryFeature),
      provideEffects(CategoryEffect),
      provideEffects(ProductSpecEffects),
      provideState(productConfigItemFeature)
    ],
  },
];
