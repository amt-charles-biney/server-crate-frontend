import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductItem } from '../../../types';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productUserUrl: string = environment.products_user
  categoryUserUrl: string = environment.category_user

  constructor(private http: HttpClient) { }

  getProduct(id: string) {
    return this.http.get<ProductItem>(`${this.productUserUrl}/${id}`)
  }

  getProductConfiguration(categoryId: string) {
    return this.http.get<any>(`${this.categoryUserUrl}/${categoryId}/config`)
  }
}
