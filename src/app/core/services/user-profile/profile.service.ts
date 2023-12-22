import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangeContact, GeneralInfo, Success } from '../../../types';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private profileUrl = environment.profile
  constructor(private http: HttpClient) { }

  getGeneralInfo() {
    return this.http.get<GeneralInfo>(`${this.profileUrl}/basic-info`)
  }

  updateGeneralInfo(form: ChangeContact) {
    return this.http.put<Success>(`${this.profileUrl}/basic-info`, form)
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
