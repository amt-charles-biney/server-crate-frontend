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
import { passwordRegex } from '../../core/utils/constants/patterns';
import { MatDialog } from '@angular/material/dialog';
import { TermsModalComponent } from '../../shared/components/terms-modal/terms-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { displaySuccess, reset, signUp } from '../../store/signup/actions/signup.actions';
import { AppState, UserSignUp } from '../../types';
import { BehaviorSubject, Observable, Subject, combineLatest, map, tap } from 'rxjs';
import { selectIsError, selectIsLoading, selectMessage } from '../../store/signup/reducers/signup.reducers';
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
  ],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpComponent implements OnInit {
  signUpForm!: FormGroup;
  private loadingState$ = new Subject<{isLoading: boolean, isError: boolean, message: string}>();
  loadingState = this.loadingState$.asObservable();
  constructor(public termsModal: MatDialog, private destroyRef: DestroyRef, private store: Store) {
    this.loadingState = combineLatest(
      [this.store.select(selectMessage),
      this.store.select(selectIsLoading),
      this.store.select(selectIsError),
    ]
    ).pipe(map(([message, isLoading, isError]: [string, boolean, boolean]) => {
      return { isLoading, message, isError }
    }))
  }
  ngOnInit(): void {
    this.signUpForm = new FormGroup(
      {
        name: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(passwordRegex),
        ]),
        confirmPwd: new FormControl('', [
          Validators.required,
          checkIfPasswordsMatch(),
        ]),
        acceptTerms: new FormControl(null, [
          Validators.required,
          checkIfTermsAreAccepted(),
        ]),
      },
      formValidator('password', 'confirmPwd')
    );
  }

  submitRegistrationForm() {
    if (this.signUpForm.invalid) return;

    const { email, password } = this.signUpForm.value
    const formData: UserSignUp = {
      firstName: this.signUpForm.value.name.split(' ')[0],
      lastName: this.signUpForm.value.name.split(' ')[1],
      email,
      password
    }
    localStorage.setItem('server-crate-email', email)
    this.store.dispatch(signUp(formData))
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

  get name() {
    return this.signUpForm.get('name');
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPwd() {
    return this.signUpForm.get('confirmPwd');
  }

  get acceptTerms() {
    return this.signUpForm.get('acceptTerms');
  }
}
