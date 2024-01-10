import { AccountSettingsComponent } from '../account-settings/account-settings.component';
import { HomeComponent } from './home.component';
import { Routes } from "@angular/router";
import { provideEffects } from '@ngrx/effects';
import { FeaturedProductEffect } from '../../store/product/featured-product/featured-product.effect';
import { FeaturedProductFeature } from '../../store/product/featured-product/featured-product.reducer';

export const route: Routes = [
    {
        path: '',
        children: [
            {
                path: 'settings',
                loadChildren: () => import('../account-settings/account-settings.routes').then(m => m.route)
            },
            {
                path: '',
                loadChildren: () => import('../landing/landing.routes').then(m => m.route)
            }
        ],
        component: HomeComponent
    },
]