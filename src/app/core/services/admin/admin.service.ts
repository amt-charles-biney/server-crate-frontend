import { HttpClient } from '@angular/common/http';
import { getCategories, removeFromFeature } from './../../../store/admin/products/categories.actions';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AllProducts, Select, DummyCategory, ProductItem } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  categoriesUrl = environment.categories
  productsUrl = environment.adminProducts
  brandsUrl = environment.brands
  featuresUrl = environment.featured
  constructor(private http: HttpClient) {

   }

  getCategories() {
    return this.http.get<Select[]>(this.categoriesUrl)
  }
  getBrands() {
    return this.http.get<Select[]>(this.brandsUrl)
  }

  addProduct(formData: FormData) {
    return this.http.post(this.productsUrl, formData)
  }

  getProducts(page:number) {
    return this.http.get<AllProducts>(`${this.productsUrl}?page=${page}&size=9`)
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

  updateProduct(id: string, formData: FormData) {
    return this.http.patch(`${this.productsUrl}/${id}`,formData) 
  }

  addBrand(name: string) {
    return this.http.post(`${this.brandsUrl}`, { name })
  }
  
  deleteBrand(id: string) {
    return this.http.delete(`${this.brandsUrl}/${id}`)
  }

  addToFeature(id: string) {
    return this.http.post(`${this.featuresUrl}/${id}`, {})
  }

  removeFromFeature(id: string) {
    return this.http.put(`${this.featuresUrl}/${id}`, {})
  }
}
