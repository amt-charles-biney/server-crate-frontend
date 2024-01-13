import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeContact, GeneralInfo, Success } from '../../../types';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  baseUrl = environment.base_url
  constructor(private http: HttpClient) { }

  getGeneralInfo() {
    return this.http.get<GeneralInfo>(`${this.baseUrl}/profile/basic-info`)
  }

  updateGeneralInfo(form: ChangeContact) {
    return this.http.put<Success>(`${this.baseUrl}/profile/basic-info`, form)
  }

  getUsername() {
    let user = localStorage.getItem('server-crate-user')
    if (user) {
      return JSON.parse(user)
    }
  }

  setUser(user: { firstName: string, lastName: string}) {
    localStorage.setItem('server-crate-user', JSON.stringify(user))
  }
}
