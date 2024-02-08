import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CartResponse, IParamConfigOptions, ProductItem } from '../../../types';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  base_url: string = environment.base_url

  constructor(private http: HttpClient) { }

  getProduct(id: string) {
    return this.http.get<ProductItem>(`${this.base_url}/product/${id}`)
  }

  getProductConfiguration(categoryId: string) {
    return this.http.get<any>(`${this.base_url}/category/${categoryId}/config`)
  }

  getProductConfigItem(productId: string, configOptions: IParamConfigOptions) {
    const url = `${this.base_url}/config/${productId}`;
    
    let params = new HttpParams();
    params = params.set('warranty', configOptions.warranty.toString());
    params = params.set('components', configOptions.components?.toString() || '');

    return this.http.get<any>(url, { params });
  }

  getCartItems() {
    return this.http.get<CartResponse>(`${this.base_url}/carts`)
  }

  deleteCartItem(id: string) {
    return this.http.delete(`${this.base_url}/carts/delete-item/${id}`)
  }
}
