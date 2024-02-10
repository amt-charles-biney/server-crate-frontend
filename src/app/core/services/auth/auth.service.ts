import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  OtpResend,
  ResetPassword,
  SignIn,
  Success,
  UserSignUp,
  VerifiedUser,
  Verify,
  VerifyOtp,
} from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.base_url
  constructor(private http: HttpClient) {}

  signUp(formData: UserSignUp) {
    return this.http.post<Success>(`${this.baseUrl}/auth/signup`, formData);
  }

  login(formData: SignIn) {
    return this.http.post<VerifiedUser>(`${this.baseUrl}/auth/login`, formData);
  }
  verifyEmail(user: Verify) {
    return this.http.post<VerifiedUser>(`${this.baseUrl}/auth/verify`, user);
  }
  resetPassword(email: string) {
    return this.http.post<Success>(`${this.baseUrl}/auth/reset-password`, {
      email,
    });
  }
  resendOtp(otpRequest: OtpResend) {
    return this.http.post<Success>(`${this.baseUrl}/auth/resend-otp`, otpRequest);
  }

  verifyOtp(user: VerifyOtp) {
    return this.http.post<Success>(`${this.baseUrl}/auth/verify-otp`, user);
  }
  changePassword(newPassword: ResetPassword) {
    return this.http.post<Success>(
      `${this.baseUrl}/auth/change-password`,
      newPassword
    );
  }

  getToken() {
    const token = localStorage.getItem('server-crate-token');
    if (token) {
      return token;
    }
    return '';
  }
  getEmail() {
    const email = localStorage.getItem('server-crate-email');
    if (!email) return '';
    return email;
  }
  setEmail(email: string) {
    localStorage.setItem('server-crate-email', email);
  }
  
  setToken(token: string) {
    localStorage.setItem('server-crate-token', token);
  }
}
