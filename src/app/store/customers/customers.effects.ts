import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AdminService } from "../../core/services/admin/admin.service";
import { getCustomers, gotCustomers } from "./customers.actions";
import { map, switchMap } from "rxjs";

@Injectable()
export class CustomerEffect {
    getCustomers$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getCustomers),
            switchMap(() => {
                return this.adminService.getCustomers().pipe(
                    map((customers) => {
                        return gotCustomers({ customers })
                    })
                )
            })
        )
    })


    constructor(private action$: Actions, private adminService: AdminService) {}
}