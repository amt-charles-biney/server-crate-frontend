import { Routes } from "@angular/router";

export const route: Routes = [
    {
        path: '',
        loadComponent: () => import('./landing.component').then(m => m.LandingComponent),
    }
]