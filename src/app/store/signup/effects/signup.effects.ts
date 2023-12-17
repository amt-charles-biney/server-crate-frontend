import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from '../../../core/services/auth.service';
import { catchError, exhaustMap, map, of, tap } from 'rxjs';
import { AuthFailure, SignUpSuccess, UserSignUp } from '../../../types';
import {
  displaySuccess,
  signUp,
  signUpFailure,
  signUpSuccess,
} from '../actions/signup.actions';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';

@Injectable()
export class SignUpEffect {
  signUp$ = createEffect(() =>
    this.action$.pipe(
      ofType(signUp),
      tap(userData => console.log('userData', userData)),
      exhaustMap((signUpData: UserSignUp) => {
        console.log('Data', signUpData);

        return this.signUpService.signUp(signUpData).pipe(
          tap((data: SignUpSuccess) => console.log('Sign up', data)),
          map((data: SignUpSuccess) => {
            console.log('Successfull');
            setTimeout(() => {
              this.router.navigateByUrl('/otp', { replaceUrl: true });
            }, 2000);
            return signUpSuccess(data);
          }),
          catchError((error) => {
            console.log('Error',error);
            return of(signUpFailure({ errorMessage: error.error.detail }));
          }),
          tap(console.log)
        );
      })
    )
  );

  constructor(
    private action$: Actions,
    private signUpService: AuthService,
    private router: Router,
  ) {}
}
