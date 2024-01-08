import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductItem } from '../../../types';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productUrl: string = environment.products_user

  constructor(private http: HttpClient) { }

  getProduct(id: string) {
    return this.http.get<ProductItem>(`${this.productUrl}/${id}`)
  }

  getProductConfiguration(categoryId: string) {
    return this.http.get<any>(`${this.productUrl}/config/${categoryId}`)
  }
}
