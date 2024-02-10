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
import { CommonModule, NgOptimizedImage } from '@angular/common';
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
    NgOptimizedImage,
    AuthLoaderComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loadingState$!: Observable<LoadingStatus>

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
      ]),
    })
    this.loadingState$ = this.store.select(selectLoaderState)
  }

  constructor(private store: Store) {

  }

  submitRegistrationForm() {
    console.log('Form Data', this.loginForm.value);
    if (this.loginForm.invalid) return;    
    console.log(
      'Form Data Submitted',
      this.loginForm.value,
    );
    const { email, password } = this.loginForm.value
    this.store.dispatch(signIn({ email, password }))
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}
