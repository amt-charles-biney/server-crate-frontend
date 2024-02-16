import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getCases, gotCases } from "./case.actions";
import { exhaustMap, map, tap } from "rxjs";
import { AdminService } from "../../core/services/admin/admin.service";
import { Case } from "../../types";

@Injectable()
export class CaseEffect {
    gotCases$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getCases),
            exhaustMap(() => {
                return this.adminService.getCases().pipe(
                    tap((cases: any) => {
                        console.log('Cases', cases.content);  
                    }),
                    map((response: any) => {
                        const cases: Case[] = response.content
                        return gotCases({cases: cases })
                    })
                )
            })
        )
    }, )

    constructor(private action$: Actions, private adminService: AdminService) {}
}