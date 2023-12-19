import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../../core/services/auth.service";
import { sendingResetLink } from "../actions/reset.actions";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { Success } from "../../../types";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { setLoadingSpinner } from "../../loader/actions/loader.actions";

@Injectable()
export class ResetEffect {
    reset$ = createEffect(() => {
        return this.action$.pipe(
            ofType(sendingResetLink),
            tap(x => console.log('Received from of', x)),
            exhaustMap(({email}) => {
                return this.authService.resetPassword(email).pipe(
                    tap(x => console.log('Auth', x)),
                    map((message: Success) => {
                        setTimeout(() => {
                            this.router.navigateByUrl('/forgot-password/otp', { replaceUrl: true })
                        }, 2000);
                        
                        return setLoadingSpinner({
                            status: false,
                            message: message.message,
                            isError: false,
                          });
                    }),
                    catchError((err) => {
                        console.log('Err', err);
                        return of(setLoadingSpinner({ status: false, message: err.error.detail, isError: true}))
                    }),
                )
            })
        )
    })

    constructor(private action$: Actions, private router: Router,  private authService: AuthService, private store: Store) {}
}