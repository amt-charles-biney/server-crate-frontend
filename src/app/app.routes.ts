import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

export const routes: Routes = [
    {
        path: 'product/configure/:id',
        loadChildren: () => import('./features/product-configure/product-configure.routes').then(m => m.route),
        providers: [
            provideState(productConfigFeature),
            provideEffects(ProductSpecEffects)
        ]
    },

];
