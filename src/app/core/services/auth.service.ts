import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { SignIn, SignUpSuccess, UserSignUp, VerifiedUser, Verify } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  backendUrl = environment.base
  constructor(private http: HttpClient) { 

  }

  signUp(formData: UserSignUp) {
    console.log('FormData submitted', formData);
    
    return this.http.post<SignUpSuccess>(`${this.backendUrl}/signup`, formData)
  }

  verifyEmail(user: Verify) {
    return this.http.post<VerifiedUser>(`${this.backendUrl}/verify`, user)
  }

  login(formData: SignIn) {
    return this.http.post<VerifiedUser>(`${this.backendUrl}/login`, formData)
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

  setToken(token: string) {
    localStorage.setItem('server-crate-token', token)
  }
}
