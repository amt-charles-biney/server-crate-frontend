import { Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings.component";
import { GeneralInformationComponent } from "./features/general-information/general-information.component";
import { PasswordInformationComponent } from "./features/password-information/password-information.component";
import { ShippingInformationComponent } from "./features/shipping-information/shipping-information.component";
import { PaymentDetailsComponent } from "./features/payment-details/payment-details.component";
import { TermsAndConditionsComponent } from "../../shared/components/terms-and-conditions/terms-and-conditions.component";
import { PrivacyPolicyComponent } from "../../shared/components/privacy-policy/privacy-policy.component";
import { provideEffects } from "@ngrx/effects";
import { ChangePasswordEffect } from "../../store/profile/changePassword/changePassword.effects";

export const route: Routes = [
    {
        path: '',
        component: AccountSettingsComponent,
        children: [
            {
                path: 'general',
                component: GeneralInformationComponent
            },
            {
                path: 'password',
                component: PasswordInformationComponent,
                providers: [
                    provideEffects(ChangePasswordEffect)
                ],
            },
            {
                path: 'shipping',
                component: ShippingInformationComponent
            },
            {
                path: 'payment',
                component: PaymentDetailsComponent
            },
            {
                path: 'terms-conditions',
                component: TermsAndConditionsComponent
            },
            {
                path: 'privacy-policy',
                component: PrivacyPolicyComponent
            },
            
        ]
    },
    
]