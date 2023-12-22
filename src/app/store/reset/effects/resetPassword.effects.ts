import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../../core/services/auth/auth.service";
import { Store } from "@ngrx/store";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { sendNewPassword } from "../actions/reset.actions";
import { ResetPassword, Success } from "../../../types";
import { setLoadingSpinner } from "../../loader/actions/loader.actions";

@Injectable()
export class ResetPasswordEffect {
    resetPassword$ = createEffect(() => {
        return this.action$.pipe(
            ofType(sendNewPassword),
            exhaustMap((changePassword: ResetPassword) => {
                return this.authService.changePassword(changePassword).pipe(
                    tap(x => console.log('Reset Password', x)),
                    map((message: Success) => {
                        setTimeout(() => {
                            this.router.navigateByUrl('/settings', { replaceUrl: true })
                        }, 2000);
                        
                        return setLoadingSpinner({
                            status: false,
                            message: message.message,
                            isError: false,
                          });
                    }),
                    catchError((err) => {
                        console.log('Err', err);
                        return of(setLoadingSpinner({ status: false, message: err.error.detail ?? '', isError: true}))
                    }),
                )
            })
        )
    })

    constructor(private action$: Actions, private router: Router,  private authService: AuthService, private store: Store) {}

}