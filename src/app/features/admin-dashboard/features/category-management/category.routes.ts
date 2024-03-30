import { Routes } from "@angular/router";
import { CategoryManagementComponent } from "./category-management.component";
import { AddCategoryComponent } from "../add-category/add-category.component";

export const routes: Routes = [
    {
        path: '',
        component: CategoryManagementComponent,
    },
    {
        path: 'add-category',
        component: AddCategoryComponent,
    },
    {
        path: 'add-category/:id',
        component: AddCategoryComponent,
    },
]