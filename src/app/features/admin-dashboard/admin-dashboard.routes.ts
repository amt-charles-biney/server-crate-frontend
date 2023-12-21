import { Routes } from "@angular/router";
import { AdminDashboardComponent } from "./admin-dashboard.component";
import { ProductsPageComponent } from "./features/products-page/products-page.component";

export const route: Routes = [
    {
        path: '',
        component: AdminDashboardComponent,
        children: [
            {
                path: 'products',
                component: ProductsPageComponent
            }
        ]
    }
]