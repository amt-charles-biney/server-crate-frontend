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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset',
  standalone: true,
  imports: [
    CommonModule,
    CustomInputComponent,
    RouterLink,
    CustomButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    NgOptimizedImage,
    RouterModule
  ],
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.scss'
})
export class ResetComponent {

}
