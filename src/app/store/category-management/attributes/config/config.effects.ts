import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { sendConfig } from "./category.actions";
import { catchError, map, of, switchMap } from "rxjs";
import { AdminService } from "../../../../core/services/admin/admin.service";
import { Store } from "@ngrx/store";
import { resetLoader, setLoadingSpinner } from "../../../loader/actions/loader.actions";
import { Router } from "@angular/router";

@Injectable()
export class ConfigEffect {
    sendConfig$ = createEffect(() => {
        return this.action$.pipe(
            ofType(sendConfig),
            switchMap((props) => {
                return this.adminService.createCategoryConfig(props).pipe(
                    map(() => {
                        this.store.dispatch(setLoadingSpinner({
                          isError: false,
                          message: 'Created new category',
                          status: false
                        }))
                        setTimeout(() => {
                          this.store.dispatch(resetLoader({isError: false, message: '', status: false }))
                          this.router.navigateByUrl('/admin/category-management')
                        }, 1500);
                      }),
                    catchError((err) => {
                        return of(
                            setLoadingSpinner({
                              isError: true,
                              message: err.error.detail,
                              status: false,
                            })
                          );
                    })
                )
            })
        )
    }, { dispatch: false })


    constructor(private action$: Actions, private store: Store, private adminService: AdminService, private router: Router) {}
}