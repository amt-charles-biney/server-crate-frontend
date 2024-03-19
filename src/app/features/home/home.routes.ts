import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authGuard } from '../../core/guards/auth.guard';
import { settingsGuard } from '../../core/guards/settings.guard';
import { HomeComponent } from './home.component';
import { Routes } from '@angular/router';
import { FeaturedProductFeature } from '../../store/product/featured-product/featured-product.reducer';
import { FeaturedProductEffect } from '../../store/product/featured-product/featured-product.effect';
import { productsFeature, recommendationsFeature } from '../../store/admin/products/products.reducers';
import { categoryFeature } from '../../store/admin/products/categories.reducers';
import { UserEffect } from '../../store/users/users.effects';
import { CategoryEffect } from '../../store/admin/products/categories.effect';
import { ProductsEffect } from '../../store/admin/products/products.effects';
import { CartComponent } from '../cart/cart.component';
import { productCartItemFeature, productConfigFeature, productConfigItemFeature } from '../../store/product-spec/product-spec.reducer';
import { ProductSpecEffects } from '../../store/product-spec/product-spec.effect';
import { CheckoutEffect } from '../../store/checkout/checkout.effects';
import { checkoutFeature, verificationFeature } from '../../store/checkout/checkout.reducers';
import { paymentFeature, shippingFeature } from '../../store/account-settings/general-info/general-info.reducers';
import { GeneralInfoEffect } from '../../store/account-settings/general-info/general-info.effects';


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
                    provideEffects(FeaturedProductEffect),
                ]
            },
            {
                path: 'servers',
                loadComponent: () => import('../preference-selection/preference-selection.component').then(m => m.PreferenceSelectionComponent),
                providers: [
                    provideEffects(ProductsEffect),
                    provideEffects(CategoryEffect),
                    provideEffects(UserEffect),
                    provideState(productsFeature),
                    provideState(categoryFeature),
                ]
            },
            {
                path: 'compare',
                loadComponent: () => import('../compare/compare.component').then(c => c.CompareComponent)
            },
            {
                path: 'product/configure/:id',
                loadChildren: () => import('../product-configure/product-configure.routes').then(m => m.route),
                providers: [
                    provideState(productConfigFeature),
                    provideEffects(ProductSpecEffects),
                    provideState(productCartItemFeature),
                    provideState(productConfigItemFeature)
                ]
            },
            {
                path: 'checkout',
                loadComponent: () => import('../checkout/checkout.component').then(m => m.CheckoutComponent),
                providers: [
                    provideEffects(CheckoutEffect),
                    provideState(checkoutFeature),
                    provideState(verificationFeature),
                    provideState(shippingFeature),
                    provideState(paymentFeature),
                    provideEffects(GeneralInfoEffect)
                ]
            },
            {
                path: 'cart',
                component: CartComponent,
                providers: [
                    provideEffects(ProductsEffect),
                    provideState(recommendationsFeature)
                ]
            },
        ],
        component: HomeComponent,
    },
]