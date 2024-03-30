import { Routes } from "@angular/router";
import { ProductsPageComponent } from "./products-page.component";
import { AddProductComponent } from "../add-product/add-product.component";
import { provideEffects } from "@ngrx/effects";
import { provideState } from "@ngrx/store";
import { CategoryEffect } from "../../../../store/admin/products/categories.effect";
import { configurationFeature } from "../../../../store/admin/products/configuration.reducers";
import { categoryFeature } from "../../../../store/admin/products/categories.reducers";
import { productsFeature } from "../../../../store/admin/products/products.reducers";


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