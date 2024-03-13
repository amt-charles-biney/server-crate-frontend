import { provideState } from "@ngrx/store";
import { GeneralInformationComponent } from "../../../account-settings/features/general-information/general-information.component";
import { provideEffects } from "@ngrx/effects";
import { PasswordInformationComponent } from "../../../account-settings/features/password-information/password-information.component";
import { ChangePasswordEffect } from "../../../../store/profile/changePassword/changePassword.effects";
import { ShippingInformationComponent } from "../../../account-settings/features/shipping-information/shipping-information.component";
import { PaymentDetailsComponent } from "../../../account-settings/features/payment-details/payment-details.component";
import { TermsAndConditionsComponent } from "../../../../shared/components/terms-and-conditions/terms-and-conditions.component";
import { PrivacyPolicyComponent } from "../../../../shared/components/privacy-policy/privacy-policy.component";
import { generalInfoFeature, paymentFeature, shippingFeature } from "../../../../store/account-settings/general-info/general-info.reducers";
import { GeneralInfoEffect } from "../../../../store/account-settings/general-info/general-info.effects";
import { Routes } from "@angular/router";
import { SettingsComponent } from "./settings.component";

export const route: Routes = [
    {
        path: '',
        component: SettingsComponent,
        children: [
            {
                path: 'general',
                component: GeneralInformationComponent,
                providers: [
                    provideState(generalInfoFeature),
                    provideEffects(GeneralInfoEffect)
                ]
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
                component: ShippingInformationComponent,
                providers: [
                    provideState(shippingFeature)
                ]
            },
            {
                path: 'payment',
                component: PaymentDetailsComponent,
                providers: [
                    provideState(paymentFeature)
                ]
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