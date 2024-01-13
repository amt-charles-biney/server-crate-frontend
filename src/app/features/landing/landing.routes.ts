import { Routes } from "@angular/router";
import { LandingComponent } from "./landing.component";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { FeaturedProductEffect } from "../../store/product/featured-product/featured-product.effect";
import { FeaturedProductFeature } from "../../store/product/featured-product/featured-product.reducer";

export const route: Routes = [
    {
        path: '',
        component: LandingComponent,
        providers: [
            provideState(FeaturedProductFeature),
            provideEffects(FeaturedProductEffect),
        ]
    }
]