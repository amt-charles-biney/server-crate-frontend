import { Routes } from "@angular/router";
import { AccountSettingsComponent } from "./account-settings.component";
import { GeneralInformationComponent } from "./features/general-information/general-information.component";
import { provideEffects } from "@ngrx/effects";
import { GeneralInfoEffect } from "../../store/account-settings/general-info/general-info.effects";
import { provideState } from "@ngrx/store";
import { generalInfoFeature } from "../../store/account-settings/general-info/general-info.reducers";

export const route: Routes = [
    {
        path: '',
        component: AccountSettingsComponent,
        children: [
            {
                path: 'general',
                component: GeneralInformationComponent,
                providers: [
                    provideState(generalInfoFeature),
                    provideEffects(GeneralInfoEffect)
                ]
            },
        ]
    },
    
]