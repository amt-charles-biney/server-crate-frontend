import { Component } from '@angular/core';
import { OTPComponent } from '../../shared/components/otp/otp.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-otpsignup',
  standalone: true,
  imports: [OTPComponent, NgOptimizedImage],
  templateUrl: './otpsignup.component.html',
  styleUrl: './otpsignup.component.scss'
})
export class OTPSignupComponent {
}
