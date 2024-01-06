import { Routes } from "@angular/router";
import { ResetComponent } from "./reset.component";
import { ResetLinkComponent } from "./reset-link/reset-link.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { OTPComponent } from "../../shared/components/otp/otp.component";
import { provideEffects } from "@ngrx/effects";
import { VerifyOtpEffects } from "../../store/reset/effects/verifyOtp.effects";
import { ResetPasswordEffect } from "../../store/reset/effects/resetPassword.effects";

export const route: Routes = [
    {
        path: '',
        component: ResetComponent,
        children: [
            {
                path: 'reset-link',
                component: ResetLinkComponent
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
                providers: [
                    provideEffects(ResetPasswordEffect)
                ]
            },
            {
                path: 'otp',
                component: OTPComponent,
                providers: [
                    provideEffects(VerifyOtpEffects)
                ]
            }
        ]
    },
]