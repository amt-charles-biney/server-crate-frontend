import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  ChangeContact, GeneralInfo, Success, Username } from '../../../types';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LOCALSTORAGE_USER } from '../../utils/constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private baseUrl = environment.base_url
  private initials: BehaviorSubject<Username> = new BehaviorSubject<Username>(this.getUsername());

  constructor(private http: HttpClient) { }
  getGeneralInfo() {
    return this.http.get<GeneralInfo>(`${this.baseUrl}/profile/basic-info`)
  }

  updateGeneralInfo(form: ChangeContact) {
    return this.http.put<Success>(`${this.baseUrl}/profile/basic-info`, form)
  }

  getUsername() {
    let user = localStorage.getItem(LOCALSTORAGE_USER)
    if (user) {
      return JSON.parse(user)
    }
  }

  getUser() {
    return this.initials.asObservable()
  }

  setUser(user: Username) {
    localStorage.setItem(LOCALSTORAGE_USER, JSON.stringify(user))
    this.initials.next(user)
  }
}
