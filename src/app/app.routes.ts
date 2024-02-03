import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';
import { productConfigFeature, productConfigItemFeature } from './store/product-spec/product-spec.reducer';
import { ProductSpecEffects } from './store/product-spec/product-spec.effect';

export const routes: Routes = [
    {
        path: 'product/configure/:id',
        loadChildren: () => import('./features/product-configure/product-configure.routes').then(m => m.route),
        providers: [
            provideState(productConfigFeature),
            provideEffects(ProductSpecEffects),
            provideState(productConfigItemFeature)
        ]
    },

];
