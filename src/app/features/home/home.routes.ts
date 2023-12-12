import { AccountSettingsComponent } from '../account-settings/account-settings.component';
import { HomeComponent } from './home.component';
import { Routes } from "@angular/router";

export const route: Routes = [
    {
        path: '',
        children: [
            {
                path: 'settings',
                loadChildren: () => import('../account-settings/account-settings.routes').then(m => m.route)
            }
        ],
        component: HomeComponent
    }
]