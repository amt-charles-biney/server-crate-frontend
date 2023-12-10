import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
  ],
  templateUrl: './reset-link.component.html',
  styleUrl: './reset-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetLinkComponent {
  resetForm !: FormGroup

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    })
  }

  get email() {
    return this.resetForm.get('email')
  }
}
