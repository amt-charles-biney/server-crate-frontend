import { VerifiedUser } from './../../../types';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, exhaustMap, map, of, tap } from "rxjs";
import { signIn, signInFailure, signInSuccess } from "../actions/login.actions";
import { SignIn } from "../../../types";
import { AuthService } from "../../../core/services/auth.service";
import { setLoadingSpinner } from '../../loader/actions/loader.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class LoginEffect {
    login$ = createEffect(() => {
        return this.action$.pipe(
            ofType(signIn),
            tap(x => console.log('Loggin in', x)),
            exhaustMap((formData: SignIn) => {
                return this.authService.login(formData).pipe(
                    tap(x => console.log('service---->', x)),
                    map((response: VerifiedUser) => {
                        this.authService.setToken(response.token)
                        // this.store.dispatch(setLoadingSpinner({
                        //     status: false,
                        //     message:
                        //       'Login Successful',
                        //     isError: false,
                        //   }))
                        setTimeout(() => {
                            this.router.navigateByUrl('/settings', { replaceUrl: true })
                        }, 1500);
                        return signInSuccess(response)
                    }),
                    catchError((err) => {
                        return of(signInFailure({errorMessage: err.error.detail}))
                    })
                )
                
            })
        )
    })
    constructor(
        private action$: Actions,
        private router: Router,
        private authService: AuthService,
        private store: Store
    ) {}
}