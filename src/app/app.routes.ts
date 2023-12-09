import { SignUpComponent } from './features/sign-up/sign-up.component';
import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'signup',
        loadChildren: () => import('./features/sign-up/sign-up.routes').then(m => m.route)
        // component: SignUpComponent
    }
];
