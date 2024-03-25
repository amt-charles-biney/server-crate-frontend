import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../core/services/user/user.service";
import { getProductComparisons, gotProductComparisons } from "./compare.actions";
import { EMPTY, catchError, exhaustMap, map } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { errorHandler } from "../../core/utils/helpers";

@Injectable()
export class CompareEffect {

    getProductComparisons$ = createEffect(() => {
        return this.action$.pipe(
            ofType(getProductComparisons),
            exhaustMap(() => {
                return this.userService.getComparisons().pipe(
                    map((comparisons) => {
                        return gotProductComparisons(comparisons)
                    }),
                    catchError(err => {
                        this.toast.error(errorHandler(err), "Error")
                        return EMPTY
                    })
                )
            })
        )
    })

    constructor(private action$: Actions, private userService: UserService, private toast: ToastrService) {}
}