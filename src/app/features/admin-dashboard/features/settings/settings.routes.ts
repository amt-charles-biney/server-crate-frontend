import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { ChangePasswordEffect } from "../../../../store/profile/changePassword/changePassword.effects";
import { generalInfoFeature, paymentFeature, shippingFeature } from "../../../../store/account-settings/general-info/general-info.reducers";
import { GeneralInfoEffect } from "../../../../store/account-settings/general-info/general-info.effects";
import { Routes } from "@angular/router";

export const route: Routes = [
    {
        path: '',
        providers: [
            provideEffects(GeneralInfoEffect),
        ],
        children: [
            {
                path: 'general',
                loadComponent: () => import('../../../account-settings/features/general-information/general-information.component').then(m => m.GeneralInformationComponent),
                providers: [
                    provideState(generalInfoFeature),
                ]
            },
            {
                path: 'password',
                loadComponent: () => import('../../../account-settings/features/password-information/password-information.component').then(m => m.PasswordInformationComponent) ,
                providers: [
                    provideEffects(ChangePasswordEffect)
                ],
            },
            {
                path: 'shipping',
                loadChildren: () => import('../../../account-settings/features/shipping-information/shipping-information.component').then(m => m.ShippingInformationComponent),
                providers: [
                    provideState(shippingFeature)
                ]
            },
            {
                path: 'payment',
                loadChildren: () => import('../../../account-settings/features/payment-details/payment-details.component').then(m => m.PaymentDetailsComponent),
                providers: [
                    provideState(paymentFeature)
                ]
            },
            {
                path: 'terms-conditions',
                loadComponent: () => import('../../../../shared/components/terms-and-conditions/terms-and-conditions.component').then(m => m.TermsAndConditionsComponent)
            },
            {
                path: 'privacy-policy',
                loadComponent: () => import('../../../../shared/components/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
            },
            
        ]
    },
    
]