import { Routes } from "@angular/router";
import { OrderDetailsComponent } from "./features/order-details/order-details.component";
import { OrdersComponent } from "./orders.component";
import { provideState } from "@ngrx/store";
import { singleOrderFeature } from "../../../../store/orders/order.reducers";

export const routes: Routes = [
    {
        path: '',
        component: OrdersComponent,
    },
    {
        path: ':id',
        component: OrderDetailsComponent,
        providers: [
            provideState(singleOrderFeature)
        ]
    }
]