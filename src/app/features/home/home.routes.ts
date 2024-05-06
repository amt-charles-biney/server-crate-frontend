import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authGuard } from '../../core/guards/auth.guard';
import { settingsGuard } from '../../core/guards/settings.guard';
import { HomeComponent } from './home.component';
import { Routes } from '@angular/router';
import { FeaturedProductFeature } from '../../store/product/featured-product/featured-product.reducer';
import { FeaturedProductEffect } from '../../store/product/featured-product/featured-product.effect';
import { allProductsFeature, recommendationsFeature } from '../../store/admin/products/products.reducers';
import { UserEffect } from '../../store/users/users.effects';
import { CartComponent } from '../cart/cart.component';
import { CheckoutEffect } from '../../store/checkout/checkout.effects';
import { addressValidationFeature, checkoutFeature, verificationFeature } from '../../store/checkout/checkout.reducers';
import { paymentFeature, shippingFeature } from '../../store/account-settings/general-info/general-info.reducers';
import { GeneralInfoEffect } from '../../store/account-settings/general-info/general-info.effects';
import { productCartItemFeature, productConfigFeature, productConfigItemFeature } from '../../store/product-spec/product-spec.reducer';
import { ProductSpecEffects } from '../../store/product-spec/product-spec.effect';
import { CompareEffect } from '../../store/compare/compare.effects';
import { compareFeature } from '../../store/compare/compare.reducers';
import { NotFoundPageComponent } from '../not-found-page/not-found-page.component';

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
            },
            {
                path: 'servers',
                loadComponent: () => import('../preference-selection/preference-selection.component').then(m => m.PreferenceSelectionComponent),
                providers: [
                    provideEffects(UserEffect),
                    provideState(productConfigFeature),
                    provideState(productConfigItemFeature)
                ]
            },
            {
                path: 'product/configure/:id',
                loadChildren: () =>
                  import('../product-configure/product-configure.routes').then(
                    (m) => m.route
                  ),
                providers: [
                  provideState(productConfigFeature),
                  provideEffects(ProductSpecEffects),
                  provideState(productCartItemFeature),
                  provideState(productConfigItemFeature),
                ],
              },
            {
                path: 'compare',
                loadComponent: () => import('../compare/compare.component').then(c => c.CompareComponent),
                providers:  [
                    provideEffects(CompareEffect),
                    provideState(compareFeature),
                    provideState(allProductsFeature)
                ]
            },
            {
                path: 'wishlist',
                loadComponent: () => import('../wishlist/wishlist.component').then(c => c.WishlistComponent),
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
                    provideState(addressValidationFeature),
                    provideState(shippingFeature),
                    provideState(paymentFeature),
                    provideEffects(GeneralInfoEffect)
                ]
            },
            {
                path: 'cart',
                component: CartComponent,
                providers: [
                    provideState(recommendationsFeature)
                ]
            },
            {
                path: '**',
                component: NotFoundPageComponent
            }
        ],
        component: HomeComponent,
        providers: [
            provideState(FeaturedProductFeature),
            provideEffects(FeaturedProductEffect),
        ]
    },
]