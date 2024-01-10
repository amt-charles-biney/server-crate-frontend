import { provideState } from '@ngrx/store';
import { authGuard } from '../../core/guards/auth.guard';
import { settingsGuard } from '../../core/guards/settings.guard';
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
                loadChildren: () => import('../account-settings/account-settings.routes').then(m => m.route),
                canActivate: [
                    settingsGuard,
                    authGuard
                ]
            },
            {
                path: '',
                loadChildren: () => import('../landing/landing.routes').then(m => m.route),
                providers: [
                    provideState(FeaturedProductFeature),
                    provideEffects(FeaturedProductEffect)
                ]
            }
        ],
        component: HomeComponent
    },
]