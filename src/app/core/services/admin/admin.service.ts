import { HttpClient } from '@angular/common/http';
import { getCategories } from './../../../store/admin/products/categories.actions';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Category, DummyCategory, ProductItem } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  categoriesUrl = environment.categories
  productsUrl = environment.products
  constructor(private http: HttpClient) {

   }

  getCategories() {
    return this.http.get<Category[]>(this.categoriesUrl)
  }

  addProduct(formData: FormData) {
    return this.http.post(this.productsUrl, formData)
  }

  getProducts() {
    return this.http.get<ProductItem[]>(this.productsUrl)
  }

  getProduct(id: string) {
    return this.http.get<ProductItem>(`${this.productsUrl}/${id}`)
  }

  getCategoryConfiguration(id: string) {
    return this.http.get(`${this.categoriesUrl}/${id}/config`)
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.productsUrl}/${id}`)
  }
}
