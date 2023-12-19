import { provideEffects } from '@ngrx/effects';
import { settingsGuard } from '../../core/guards/settings.guard';
import { HomeComponent } from './home.component';
import { Routes } from "@angular/router";
import { ChangePasswordEffect } from '../../store/profile/changePassword/changePassword.effects';

export const route: Routes = [
    {
        path: '',
        children: [
            {
                path: 'settings',
                loadChildren: () => import('../account-settings/account-settings.routes').then(m => m.route),
                providers: [
                    provideEffects(ChangePasswordEffect)
                ],
                canActivate: [
                    settingsGuard
                ]
            }
        ],
        component: HomeComponent
    }
]