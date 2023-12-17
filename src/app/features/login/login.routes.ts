import { Routes } from "@angular/router";
import { LoginComponent } from "./login.component";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { loginFeature } from "../../store/signin/reducers/login.reducers";
import { LoginEffect } from "../../store/signin/effects/login.effects";

export const route: Routes = [
    {
        path: '',
        component: LoginComponent,
        providers: [
            provideState(loginFeature),
            provideEffects(LoginEffect)
        ]
    }
]