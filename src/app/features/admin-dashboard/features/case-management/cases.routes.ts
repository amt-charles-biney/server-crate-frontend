import { Routes } from "@angular/router";
import { CaseManagementComponent } from "./case-management.component";
import { AddCaseComponent } from "./features/add-case/add-case.component";

export const routes: Routes = [
    {
        path: '',
        component: CaseManagementComponent,
    },
    {
        path: 'add-case',
        component: AddCaseComponent,
    },
    {
        path: 'add-case/:id',
        component: AddCaseComponent,
    }
]