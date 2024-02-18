import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getCases, getSingleCase, gotCases, gotSingleCase } from "./case.actions";
import { catchError, exhaustMap, map, of, switchMap, tap } from "rxjs";
import { AdminService } from "../../core/services/admin/admin.service";
import { Case, CaseResponse } from "../../types";
import { setLoadingSpinner } from "../loader/actions/loader.actions";
import { errorHandler } from "../../core/utils/helpers";

@Injectable()
export class CaseEffect {
    gotCases$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getCases),
            exhaustMap(() => {
                return this.adminService.getCases().pipe(
                    tap((cases: CaseResponse) => {
                        console.log('Cases', cases);  
                    }),
                    map((response: CaseResponse) => {
                        return gotCases({cases: response })
                    })
                )
            })
        )
    })

    getCase$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getSingleCase),
            switchMap(({ id }) => {
                return this.adminService.getCase(id).pipe(
                    map((data: Case) => {
                        
                        return gotSingleCase(data)
                    }),
                    catchError((err) => {
                        return of(
                            setLoadingSpinner({
                                isError: true,
                                message: errorHandler(err),
                                status: false
                            })
                        )
                    })
                )
            })
        )
    })

    constructor(private action$: Actions, private adminService: AdminService) {}
}