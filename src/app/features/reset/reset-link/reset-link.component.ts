import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CustomInputComponent } from '../../../shared/components/custom-input/custom-input.component';
import { RouterLink } from '@angular/router';
import { CustomButtonComponent } from '../../../shared/components/custom-button/custom-button.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Store } from '@ngrx/store';
import { sendingResetLink } from '../../../store/reset/actions/reset.actions';
import { Observable } from 'rxjs';
import {
  selectLoaderState,
} from '../../../store/loader/reducers/loader.reducers';
import { AuthLoaderComponent } from '../../../shared/components/auth-loader/auth-loader.component';
import { LoadingStatus } from '../../../types';
@Component({
  selector: 'app-reset-link',
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
  templateUrl: './reset-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetLinkComponent {
  resetForm!: FormGroup;
  loadingState$!: Observable<LoadingStatus>;

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        updateOn: 'submit',
      }),
    });
    this.loadingState$ = this.store.select(selectLoaderState);
  }

  constructor(private store: Store) {}

  get email() {
    return this.resetForm.get('email');
  }

    /**
   * Sends the user's email if it's valid
   * @returns {void}
   */
  sendResetLink(): void {
    if (this.resetForm.invalid) return ;
    return this.store.dispatch(sendingResetLink({ email: this.email?.value }));
  }
}
