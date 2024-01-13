import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AllProducts, Select } from '../../../types';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.base_url
  constructor(private http: HttpClient) { }

  getProducts(page: number, filterParams: string) {
    return this.http.get<AllProducts>(`${this.baseUrl}/product?page=${page}&size=9&${filterParams}`)
  }

  getCategories() {
    return this.http.get<Select[]>(`${this.baseUrl}/category`)
  }

  getBrands() {
    return this.http.get<Select[]>(`${this.baseUrl}/brand`)
  }
  
  getCategoryConfiguration(id: string) {
    return this.http.get(`${this.baseUrl}/category/${id}/config`)
  }

  getSearchResults(searchValue: string) {
    return this.http.get<AllProducts>(`${this.baseUrl}/search/products?query=${searchValue}`)
  }
}
