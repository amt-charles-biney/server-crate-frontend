import { Routes } from "@angular/router";
import { ProductsPageComponent } from "./products-page.component";
import { AddProductComponent } from "../add-product/add-product.component";


export const routes: Routes = [
    {
        path: '',
        component: ProductsPageComponent,
    },
    {
        path: 'add-product',
        component: AddProductComponent,
      },
      {
        path: 'add-product/:id',
        component: AddProductComponent,
      },
]