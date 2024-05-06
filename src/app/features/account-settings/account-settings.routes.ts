import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { GeneralInfoEffect } from '../../store/account-settings/general-info/general-info.effects';
import { provideState } from '@ngrx/store';
import {
  generalInfoFeature,
  paymentFeature,
  shippingFeature,
} from '../../store/account-settings/general-info/general-info.reducers';
import { ChangePasswordEffect } from '../../store/profile/changePassword/changePassword.effects';
import { orderFeature } from '../../store/orders/order.reducers';
import { OrderEffects } from '../../store/orders/order.effects';

export const route: Routes = [
  {
    path: '',
    loadComponent: () => import('../account-settings/account-settings.component').then(m => m.AccountSettingsComponent),
    providers: [
      provideEffects(GeneralInfoEffect),
      provideEffects(OrderEffects),
    ],
    children: [
      {
        path: 'general',
        loadComponent: () => import('../account-settings/features/general-information/general-information.component').then(m => m.GeneralInformationComponent),
        providers: [provideState(generalInfoFeature)],
      },
      {
        path: 'password',
        loadComponent: () => import('../account-settings/features/password-information/password-information.component').then(m => m.PasswordInformationComponent),
        providers: [provideEffects(ChangePasswordEffect)],
      },
      {
        path: 'shipping',
        loadComponent: () => import('../account-settings/features/shipping-information/shipping-information.component').then(m => m.ShippingInformationComponent),
        providers: [provideState(shippingFeature)],
      },
      {
        path: 'payment',
        loadComponent: () => import('../account-settings/features/payment-details/payment-details.component').then(m => m.PaymentDetailsComponent),
        providers: [provideState(paymentFeature)],
      },
      {
        path: 'orders',
        providers: [provideState(orderFeature)],
        loadChildren: () =>
          import('../admin-dashboard/features/orders/orders.routes').then(
            (m) => m.routes
          ),
      },
      {
        path: 'terms-conditions',
        loadComponent: () => import('../../shared/components/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent),
      },
      {
        path: 'privacy-policy',
        loadComponent: () => import('../../shared/components/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
      },
    ],
  },
];
