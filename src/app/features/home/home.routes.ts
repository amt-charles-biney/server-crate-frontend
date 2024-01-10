import { provideEffects } from '@ngrx/effects';
import { authGuard } from '../../core/guards/auth.guard';
import { settingsGuard } from '../../core/guards/settings.guard';
import { HomeComponent } from './home.component';
import { Routes } from "@angular/router";
import { ProductsEffect } from '../../store/admin/products/products.effects';
import { provideState } from '@ngrx/store';
import { productsFeature } from '../../store/admin/products/products.reducers';
import { CategoryEffect } from '../../store/admin/products/categories.effect';
import { configurationFeature } from '../../store/admin/products/configuration.reducers';
import { categoryFeature } from '../../store/admin/products/categories.reducers';

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
                path: 'servers',
                loadComponent: () => import('../preference-selection/preference-selection.component').then(m => m.PreferenceSelectionComponent),
                providers: [
                    provideEffects(ProductsEffect),
                    provideEffects(CategoryEffect),
                    provideState(productsFeature),
                    provideState(categoryFeature),
                ]
            },
            {
                path: 'compare',
                loadComponent: () => import('../compare/compare.component').then(m => m.CompareComponent),
                providers: [
                    provideEffects(CategoryEffect),
                    provideState(configurationFeature)
                ]
            }
        ],
        component: HomeComponent
    }
]