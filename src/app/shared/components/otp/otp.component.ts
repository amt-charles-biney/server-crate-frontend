import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { Observable } from 'rxjs';
import { CountdownComponent } from '../countdown/countdown.component';
import { Store } from '@ngrx/store';
import { verifyingEmail } from '../../../store/signup/actions/signup.actions';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingStatus } from '../../../types';
import { selectLoaderState } from '../../../store/loader/reducers/loader.reducers';
import { setLoadingSpinner } from '../../../store/loader/actions/loader.actions';
import { AuthLoaderComponent } from '../auth-loader/auth-loader.component';
import { verifyingOtp } from '../../../store/reset/actions/reset.actions';
import { Router } from '@angular/router';
import { setOtp } from '../../../store/otp/otp.actions';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOtpInputModule,
    CustomButtonComponent,
    CountdownComponent,
    FormsModule,
    AuthLoaderComponent,
  ],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OTPComponent implements OnDestroy {
  otp = new FormControl('', [
    Validators.required,
    Validators.maxLength(6),
    Validators.minLength(6),
  ]);
  time: number = Number(
    sessionStorage.getItem('server-crate-otp-expiration') ?? 5
  );
  loadingState$!: Observable<LoadingStatus>;

  constructor(
    private store: Store,
    private signUpService: AuthService,
    private router: Router
  ) {
    this.loadingState$ = this.store.select(selectLoaderState);
  }
  verifyEmail() {
    if (this.otp.invalid) {
      console.log('Invalid');
      return;
    }
    const email = this.signUpService.getEmail();
    const otp = this.otp.value ?? '';
    this.store.dispatch(setOtp({ otp }));
    const currentUrl = this.router.url;
    console.log('Current url', currentUrl);
    this.store.dispatch(
      setLoadingSpinner({ status: true, message: '', isError: false })
    );
    if (currentUrl === '/otp') {
      this.store.dispatch(verifyingEmail({ code: otp, email: email }));
    } else {
      this.store.dispatch(verifyingOtp({ otpCode: otp, email: email }));
    }
    console.log('/email and code', email, otp);
  }

  
  ngOnDestroy(): void {
    sessionStorage.clear()
  }
}
