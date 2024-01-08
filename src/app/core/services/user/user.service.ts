import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AllProducts } from '../../../types';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userProducts = environment.userProducts
  constructor(private http: HttpClient) { }

  getProducts(page: number, filterParams: string) {
    return this.http.get<AllProducts>(`${this.userProducts}?page=${page}&size=9&${filterParams}`)
  }
}
