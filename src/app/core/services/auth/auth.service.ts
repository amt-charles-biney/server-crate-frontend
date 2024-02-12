import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  ChangePassword,
  OtpResend,
  ResetPassword,
  SignIn,
  Success,
  TokenPayload,
  UserSignUp,
  VerifiedUser,
  Verify,
  VerifyOtp,
} from '../../../types';
import { jwtDecode } from 'jwt-decode';
import { LOCALSTORAGE_TOKEN } from '../../utils/constants';

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
  changePasswordInProfile(password: ChangePassword) {
    return this.http.post<Success>(`${this.baseUrl}/profile/password`, password);
  }

  getToken() {
    const token = localStorage.getItem(LOCALSTORAGE_TOKEN);
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
  isAdmin() {
    const token = this.getToken();
    if (token) {
      const decodedToken = jwtDecode<TokenPayload>(token);
      return decodedToken.role === 'ADMIN'
    }
    return false
  }
  isAuthenticated() {
    const token = this.getToken();
    if (token) return true;
    return false;
  }
  
  setToken(token: string) {
    localStorage.setItem(LOCALSTORAGE_TOKEN, token);
  }
}
