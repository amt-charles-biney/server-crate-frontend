import { HttpClient } from '@angular/common/http';
import { Attribute, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  AllProducts,
  Select,
  ProductItem,
} from '../../../types';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Select[]>(`${this.baseUrl}/admin/category`);
  }
  getBrands() {
    return this.http.get<Select[]>(`${this.baseUrl}/admin/brand`);
  }

  addProduct(formData: FormData) {
    return this.http.post(`${this.baseUrl}/admin/product`, formData);
  }

  getProducts(page: number) {
    return this.http.get<AllProducts>(
      `${this.baseUrl}/admin/product?page=${page}&size=9`
    );
  }

  getProduct(id: string) {
    return this.http.get<ProductItem>(`${this.baseUrl}/admin/product/${id}`);
  }

  getCategoryConfiguration(id: string) {
    return this.http.get(`${this.baseUrl}/admin/category/${id}/config`);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/admin/product/${id}`);
  }

  updateProduct(id: string, formData: FormData) {
    return this.http.patch(`${this.baseUrl}/admin/product/${id}`, formData);
  }

  addBrand(name: string) {
    return this.http.post(`${this.baseUrl}/admin/brand`, { name });
  }

  deleteBrand(id: string) {
    return this.http.delete(`${this.baseUrl}/admin/brand/${id}`);
  }

  addToFeature(id: string) {
    return this.http.post(`${this.baseUrl}/admin/featured/${id}`, {});
  }

  removeFromFeature(id: string) {
    return this.http.put(`${this.baseUrl}/admin/featured/${id}`, {});
  }

  getAttributes() {
    return this.http.get<Attribute[]>(`${this.baseUrl}/admin/attributes`)
  }
}
