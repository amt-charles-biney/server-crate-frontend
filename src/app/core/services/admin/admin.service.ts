import { HttpClient } from '@angular/common/http';
import { getCategories } from './../../../store/admin/products/categories.actions';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { AllProducts, Select, DummyCategory, ProductItem } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  categoriesUrl = environment.categories
  productsUrl = environment.products
  brandsUrl = environment.brands
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
    const url = `${this.categoriesUrl}/${id}/config`
    console.log('URL', url);
    return this.http.get(url)
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.productsUrl}/${id}`)
  }

  updateProduct(id: string, formData: FormData) {
    return this.http.patch(`${this.productsUrl}/${id}`,formData) 
  }
}
