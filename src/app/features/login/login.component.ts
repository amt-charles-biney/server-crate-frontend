import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { signIn } from '../../store/signin/actions/login.actions';
import { AuthLoaderComponent } from '../../shared/components/auth-loader/auth-loader.component';
import { LoadingStatus } from '../../types';
import { Observable } from 'rxjs';
import { selectLoaderState } from '../../store/loader/reducers/loader.reducers';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    CustomInputComponent,
    RouterLink,
    CustomButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    AuthLoaderComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loadingState$!: Observable<LoadingStatus>;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'submit',
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'submit',
      }),
    });
    this.loadingState$ = this.store.select(selectLoaderState);
  }

  constructor(private store: Store) {}

  /**
   * Submits the login form if it is valid.
   * Dispatches a sign-in action with the email and password from the form.
   * @returns {void}
   */
  submitLoginForm(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    this.store.dispatch(signIn({ email, password }));
  }
}
