import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {
  SignIn,
  VerifiedUser,
} from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = environment.base_url
  constructor(private http: HttpClient) {}

  

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

  setToken(token: string) {
    localStorage.setItem('server-crate-token', token);
  }
}
