import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { FeaturedProductFeature } from './store/product/featured-product/featured-product.reducer';
import { FeaturedProductEffect } from './store/product/featured-product/featured-product.effect';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then(m => m.route)
        
    }
];
