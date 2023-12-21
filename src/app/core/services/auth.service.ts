import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ChangePassword, OtpResend, ResendOtp, ResetPassword, SignIn, Success, UserSignUp, VerifiedUser, Verify, VerifyOtp } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.base
  profileUrl = environment.profile
  constructor(private http: HttpClient) { 

  }

  signUp(formData: UserSignUp) {    
    return this.http.post<Success>(`${this.backendUrl}/signup`, formData)
  }

  verifyEmail(user: Verify) {    
    return this.http.post<VerifiedUser>(`${this.backendUrl}/verify`, user)
  }
  
  verifyOtp(user: VerifyOtp) {    
    return this.http.post<Success>(`${this.backendUrl}/verify-otp`, user)
  }

  login(formData: SignIn) {
    return this.http.post<VerifiedUser>(`${this.backendUrl}/login`, formData)
  }

  resetPassword(email: string) {
    return this.http.post<Success>(`${this.backendUrl}/reset-password`, {email})
  }

  resendOtp(otpRequest: OtpResend) {
    return this.http.post<Success>(`${this.backendUrl}/resend-otp`, otpRequest)
  }

  changePassword(newPassword: ResetPassword) {
    return this.http.post<Success>(`${this.backendUrl}/change-password`, newPassword)
  }

  changePasswordInProfile(password: ChangePassword) {
    return this.http.post<Success>(`${this.profileUrl}/password`, password)
  }

  isAuthenticated() {
    const token = this.getToken()
    if (token) return true;
    return false
  }

  getToken() {
    const token = localStorage.getItem('server-crate-token')
    if (token) {
      return token
    }
    return ''
  }

  getEmail() {
    const email = localStorage.getItem('server-crate-email')
    if (!email) return ''
    return email
  }

  setEmail(email: string) {
    localStorage.setItem('server-crate-email', email)
  }

  setToken(token: string) {
    localStorage.setItem('server-crate-token', token)
  }


}
