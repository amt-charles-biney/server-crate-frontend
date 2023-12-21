import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../../core/services/auth.service";
import { Store } from "@ngrx/store";
import { verifyingOtp } from "../actions/reset.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { Success, VerifyOtp } from "../../../types";
import { setLoadingSpinner } from "../../loader/actions/loader.actions";

@Injectable()
export class VerifyOtpEffects {
    verifyOtp$ = createEffect(() => {
        return this.action$.pipe(
            ofType(verifyingOtp),
            exhaustMap((data: VerifyOtp) => {
                return this.signUpService.verifyOtp(data).pipe(
                    tap(x => console.log('Verifying otp', x)),
                    map((data: Success) => {
                        setTimeout(() => {
                            this.router.navigateByUrl('/forgot-password/reset-password', { replaceUrl: true })
                        }, 2000);
                        return setLoadingSpinner({
                            status: false,
                            message: data.message,
                            isError: false,
                          });
                    }),
                    catchError((err) => {
                        return of(setLoadingSpinner({ status: false, message: err.error.detail, isError: true}))
                    })
                )
            })
        )
    })

    constructor(
        private action$: Actions,
        private router: Router,
        private signUpService: AuthService,
        private store: Store
      ) {}
}