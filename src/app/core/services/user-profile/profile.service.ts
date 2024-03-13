import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  UserInfo, GeneralInfo, ShippingPayload, Success, Username, MobileMoneyWallet, MomoResponse, CreditCard, CardResponse } from '../../../types';
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

  updateGeneralInfo(form: UserInfo) {
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

  saveShippingDetails(shippingDetails: ShippingPayload) {
    return this.http.post(`${this.baseUrl}/profile/shipping-info`, shippingDetails)
  }

  getShippingDetails() {
    return this.http.get<ShippingPayload>(`${this.baseUrl}/profile/shipping-info`)
  }

  addMomoWallet(wallet: MobileMoneyWallet) {
    return this.http.post(`${this.baseUrl}/payment_info/mobile_money`, wallet)
  }

  getMomoWallet() {
    return this.http.get<MomoResponse>(`${this.baseUrl}/payment_info/mobile_money`)
  }

  deleteWallet(id: string) {
    return this.http.delete(`${this.baseUrl}/payment_info/${id}`)
  }

  addCreditCard(card: CreditCard) {
    return this.http.post(`${this.baseUrl}/payment_info/card`, card)
  }

  getCreditCards() {
    return this.http.get<CardResponse>(`${this.baseUrl}/payment_info/card`)
  }
}
