import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Username } from '../../../types';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = environment.base_url
  private initials: BehaviorSubject<Username> = new BehaviorSubject<Username>(this.getUsername());

  constructor(private http: HttpClient) { }

  getUsername() {
    let user = localStorage.getItem('server-crate-user')
    if (user) {
      return JSON.parse(user)
    }
  }

  getUser() {
    return this.initials.asObservable()
  }

  setUser(user: Username) {
    localStorage.setItem('server-crate-user', JSON.stringify(user))
    this.initials.next(user)
  }
}
