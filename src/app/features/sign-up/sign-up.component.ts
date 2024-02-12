import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
} from '@angular/core';
import { CustomInputComponent } from '../../shared/components/custom-input/custom-input.component';
import { RouterLink } from '@angular/router';
import { CustomButtonComponent } from '../../shared/components/custom-button/custom-button.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  checkIfPasswordsMatch,
  checkIfTermsAreAccepted,
  formValidator,
} from '../../core/utils/validators';
import { LOCALSTORAGE_USER, passwordRegex } from '../../core/utils/constants';
import { MatDialog } from '@angular/material/dialog';
import { TermsModalComponent } from '../../shared/components/terms-modal/terms-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { signUp } from '../../store/signup/actions/signup.actions';
import { LoadingStatus, UserSignUp } from '../../types';
import { AuthLoaderComponent } from '../../shared/components/auth-loader/auth-loader.component';
import { Observable } from 'rxjs';
import { selectLoaderState } from '../../store/loader/reducers/loader.reducers';
import { setLoadingSpinner } from '../../store/loader/actions/loader.actions';
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    CustomInputComponent,
    RouterLink,
    CustomButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    AuthLoaderComponent,
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  loadingState$!: Observable<LoadingStatus>;
  constructor(
    public termsModal: MatDialog,
    private destroyRef: DestroyRef,
    private store: Store
  ) {}
  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        firstName: new FormControl('', {validators: [Validators.required], updateOn: 'blur'}),
        lastName: new FormControl('', {validators: [Validators.required], updateOn: 'blur'}),
        email: new FormControl('', {validators: [Validators.required, Validators.email, ], updateOn: 'blur'}),
        password: new FormControl('', {validators:[
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(passwordRegex),
        ], updateOn: 'blur'}),
        confirmPwd: new FormControl('', {validators: [
          Validators.required,
          checkIfPasswordsMatch(),
        ], updateOn: 'blur'}),
        acceptTerms: new FormControl(null, [
          Validators.required,
          checkIfTermsAreAccepted(),
        ]),
      },
      formValidator('password', 'confirmPwd')
    );
    this.loadingState$ = this.store.select(selectLoaderState);
  }

  submitRegistrationForm() {
    if (this.signUpForm.invalid) return;
    scrollTo({ top: 0, behavior: 'smooth' });
    const { firstName, lastName, email, password } = this.signUpForm.value;
    const formData: UserSignUp = {
      firstName,
      lastName,
      email,
      password,
    };
    // this.store.dispatch(setLoadingSpinner({ status: true, message: '', isError: false }))
    localStorage.setItem(
      LOCALSTORAGE_USER,
      JSON.stringify({ firstName, lastName })
    );
    this.store.dispatch(signUp(formData));
  }

  openTermsAndConditionsModal() {
    const termsModalResult = this.termsModal.open(TermsModalComponent, {
      width: 'auto',
      autoFocus: false,
    });

    termsModalResult
      .afterClosed()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isTermsAccepted) => {
        this.signUpForm.setValue({
          ...this.signUpForm.value,
          acceptTerms: isTermsAccepted ?? this.acceptTerms?.value ?? false,
        });
      });
  }

  onFocus(control: AbstractControl) {
    const value = control.value
    control.reset()
    control.patchValue(value)
  }
  
  get firstName() {
    return this.signUpForm.get('firstName')!;
  }

  get lastName() {
    return this.signUpForm.get('lastName')!;
  }

  get email() {
    return this.signUpForm.get('email')!;
  }

  get password() {
    return this.signUpForm.get('password')!;
  }

  get confirmPwd() {
    return this.signUpForm.get('confirmPwd')!;
  }

  get acceptTerms() {
    return this.signUpForm.get('acceptTerms');
  }
}
