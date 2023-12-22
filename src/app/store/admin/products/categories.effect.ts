import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { categoryFailure, getCategories, gotCategories } from "./categories.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { AdminService } from "../../../core/services/admin/admin.service";
import { DummyCategory } from "../../../types";

@Injectable()
export class CategoryEffect {
    getCategory$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getCategories),
            tap(x => console.log('Fetch categories', x)),
            exhaustMap((response) => {
                return this.adminService.getCategories().pipe(
                    map((data: DummyCategory[]) => {
                        console.log('Fetching categories');
                        
                        return gotCategories({ categories: data })
                    }),
                    catchError((err) => {
                        console.log('Error occured', err);
                        return of(categoryFailure())
                    })
                )
            })
        )
    })


    constructor(private action$: Actions, private adminService: AdminService) {}
}