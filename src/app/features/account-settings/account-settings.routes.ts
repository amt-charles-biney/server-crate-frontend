import { Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings.component";
import { GeneralInformationComponent } from "./features/general-information/general-information.component";
import { provideEffects } from "@ngrx/effects";
import { GeneralInfoEffect } from "../../store/account-settings/general-info/general-info.effects";
import { provideState } from "@ngrx/store";
import { generalInfoFeature } from "../../store/account-settings/general-info/general-info.reducers";
import { PasswordInformationComponent } from "./features/password-information/password-information.component";
import { ChangePasswordEffect } from "../../store/profile/changePassword/changePassword.effects";
import { ShippingInformationComponent } from "./features/shipping-information/shipping-information.component";
import { PaymentDetailsComponent } from "./features/payment-details/payment-details.component";

export const route: Routes = [
    {
        path: '',
        component: AccountSettingsComponent,
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
                component: ShippingInformationComponent
            },
            {
                path: 'payment',
                component: PaymentDetailsComponent
            },
        ]
    },
    
]