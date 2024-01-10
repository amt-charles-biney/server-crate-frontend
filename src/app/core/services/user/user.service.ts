import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AllProducts, Select } from '../../../types';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  userProducts = environment.userProducts
  categoriesUrl = environment.userCategories
  brandsUrl = environment.userBrands
  constructor(private http: HttpClient) { }

  getProducts(page: number, filterParams: string) {
    return this.http.get<AllProducts>(`${this.userProducts}?page=${page}&size=9&${filterParams}`)
  }

  getCategories() {
    return this.http.get<Select[]>(this.categoriesUrl)
  }

  getBrands() {
    return this.http.get<Select[]>(this.brandsUrl)
  }
  
  getCategoryConfiguration(id: string) {
    return this.http.get(`${this.categoriesUrl}/${id}/config`)
  }
}
