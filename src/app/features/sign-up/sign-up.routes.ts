import { Routes } from "@angular/router";
import { SignUpComponent } from "./sign-up.component";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { signUpFeature } from "../../store/signup/reducers/signup.reducers";
import { SignUpEffect } from "../../store/signup/effects/signup.effects";

export const route: Routes = [
    {
        path: '',
        component: SignUpComponent,
        providers: [
            provideState(signUpFeature),
            provideEffects(SignUpEffect),
        ],
    }
]