import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductItem } from '../../../types';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  baseUrl = environment.base_url
  constructor(private http: HttpClient) { }

  getProduct(id: string) {
    return this.http.get<ProductItem>(`${this.baseUrl}/product/${id}`)
  }

  getProductConfiguration(categoryId: string) {
    return this.http.get<any>(`${this.baseUrl}/category/${categoryId}/config`)
  }
}
