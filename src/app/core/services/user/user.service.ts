import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AllProducts, PageAbleResponseData, ProductItemSubset, Select, Wishlist } from '../../../types';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.base_url
  constructor(private http: HttpClient) { }

  getProducts(page: number, filterParams: Record<string, string>) {
    return this.http.get<AllProducts>(`${this.baseUrl}/product`, { params: filterParams})
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

  getCases(): Observable<PageAbleResponseData<Select>> {
    return this.http.get<PageAbleResponseData<Select>>(`${this.baseUrl}/cases`);
  }

  getRecommendations() {
    return this.http.get<ProductItemSubset[]>(`${this.baseUrl}/recommendation`)
  }

  getWishlist() {
    return this.http.get<Wishlist>(`${this.baseUrl}/wishlists`)
  }

  addToWishlist(id: string) {
    return this.http.post(`${this.baseUrl}/wishlists/add-item/${id}`, {})
  }
}
