import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { Subject, combineLatest, map, takeWhile, tap, timer } from 'rxjs';
import { CountdownComponent } from '../countdown/countdown.component';
import { Store } from '@ngrx/store';
import {
  selectIsError,
  selectIsLoading,
  selectMessage,
} from '../../../store/signup/reducers/signup.reducers';
import { reset, verifyingEmail } from '../../../store/signup/actions/signup.actions';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    CustomButtonComponent,
    CountdownComponent,
    FormsModule
  ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OTPComponent {
  otp = new FormControl();
  time: number = Number(
    sessionStorage.getItem('server-crate-otp-expiration') ?? 5
  );

  private loadingState$ = new Subject<{
    isLoading: boolean;
    isError: boolean;
    message: string;
  }>();
  loadingState = this.loadingState$.asObservable();

  constructor(private store: Store, private signUpService: AuthService) {
    this.store.dispatch(reset())
    this.loadingState = combineLatest([
      this.store.select(selectMessage),
      this.store.select(selectIsLoading),
      this.store.select(selectIsError),
    ]).pipe(
      map(([message, isLoading, isError]: [string, boolean, boolean]) => {
        return { isLoading, message, isError };
      })
    );
  }
  verifyEmail() {
    const email = this.signUpService.getEmail()
    const otp = this.otp.value

    console.log('/email and code', email, otp);
    
    this.store.dispatch(verifyingEmail({code: otp, email: email}))
  }
}
