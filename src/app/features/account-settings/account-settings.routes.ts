import { Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings.component";
import { GeneralInformationComponent } from "./features/general-information/general-information.component";
import { TermsAndConditionsComponent } from "../../shared/components/terms-and-conditions/terms-and-conditions.component";
import { provideEffects } from "@ngrx/effects";
import { GeneralInfoEffect } from "../../store/account-settings/general-info/general-info.effects";
import { provideState } from "@ngrx/store";
import { generalInfoFeature, paymentFeature, shippingFeature } from "../../store/account-settings/general-info/general-info.reducers";
import { PasswordInformationComponent } from "./features/password-information/password-information.component";
import { ChangePasswordEffect } from "../../store/profile/changePassword/changePassword.effects";
import { ShippingInformationComponent } from "./features/shipping-information/shipping-information.component";
import { PaymentDetailsComponent } from "./features/payment-details/payment-details.component";
import { PrivacyPolicyComponent } from "../../shared/components/privacy-policy/privacy-policy.component";
import { OrdersComponent } from "../admin-dashboard/features/orders/orders.component";
import { orderFeature } from "../../store/orders/order.reducers";
import { OrderEffects } from "../../store/orders/order.effects";

export const route: Routes = [
    {
        path: '',
        component: AccountSettingsComponent,
        providers: [
            provideEffects(GeneralInfoEffect),
            provideEffects(OrderEffects)
        ],
        children: [
            {
                path: 'general',
                component: GeneralInformationComponent,
                providers: [
                    provideState(generalInfoFeature),
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
                    provideState(shippingFeature),
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
                path: 'orders',
                component: OrdersComponent,
                providers: [
                    provideState(orderFeature),
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