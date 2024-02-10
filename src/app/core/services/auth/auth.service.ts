import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  SignIn,
  Success,
  UserSignUp,
  VerifiedUser,
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

  getToken() {
    const token = localStorage.getItem('server-crate-token');
    if (token) {
      return token;
    }
    return '';
  }

  setEmail(email: string) {
    localStorage.setItem('server-crate-email', email);
  }
  
  setToken(token: string) {
    localStorage.setItem('server-crate-token', token);
  }
}
