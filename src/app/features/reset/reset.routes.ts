import { Routes } from "@angular/router";
import { provideEffects } from "@ngrx/effects";
import { VerifyOtpEffects } from "../../store/reset/effects/verifyOtp.effects";
import { ResetPasswordEffect } from "../../store/reset/effects/resetPassword.effects";

export const route: Routes = [
    {
        path: '',
        loadComponent: () => import('./reset.component').then(m => m.ResetComponent),
        children: [
            {
                path: 'reset-link',
                loadComponent: () => import('./reset-link/reset-link.component').then(m => m.ResetLinkComponent),
            },
            {
                path: 'reset-password',
                loadComponent: () => import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
                providers: [
                    provideEffects(ResetPasswordEffect)
                ]
            },
            {
                path: 'otp',
                loadComponent: () => import('../../shared/components/otp/otp.component').then(m => m.OTPComponent),
                providers: [
                    provideEffects(VerifyOtpEffects)
                ]
            }
        ]
    },
]