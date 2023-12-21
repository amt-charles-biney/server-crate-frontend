import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { AuthService } from "../../../core/services/auth.service";
import { changePassword } from "./changePassword.actions";
import { catchError, exhaustMap, map, of } from "rxjs";
import { ChangePassword } from "../../../types";
import { setLoadingSpinner } from "../../loader/actions/loader.actions";

@Injectable()
export class ChangePasswordEffect {
    changePassword$ = createEffect(() => {
        return this.action$.pipe(
            ofType(changePassword),
            exhaustMap((newPassword: ChangePassword) => {
                return this.authService.changePasswordInProfile(newPassword).pipe(
                    map((message) => {
                        console.log('CHanging profile', message)
                        return setLoadingSpinner({
                            status: false,
                            message: message.message,
                            isError: false,
                          }); 
                    }),
                    catchError((err) => {
                        console.log('Err', err);
                        const error = err.error?.detail ?? 'Please try again'
                        return of(setLoadingSpinner({ status: false, message: error, isError: true}))
                    }),
                )
            })
        )
    })


    constructor(private action$: Actions, private authService: AuthService) {}
}