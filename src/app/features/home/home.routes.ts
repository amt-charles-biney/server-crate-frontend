import { HomeComponent } from './home.component';
import { Routes } from "@angular/router";

export const route: Routes = [
    {
        path: '',
        children: [
            {
                path: '', component: HomeComponent
            }
        ]
    }
]