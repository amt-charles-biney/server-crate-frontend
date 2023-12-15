import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from  'ng-otp-input';
import { CustomButtonComponent } from '../custom-button/custom-button.component';
import { map, takeWhile, tap, timer } from 'rxjs';
import { CountdownComponent } from '../countdown/countdown.component';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOtpInputModule, CustomButtonComponent, CountdownComponent],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OTPComponent {
  otp = new FormControl()
}
