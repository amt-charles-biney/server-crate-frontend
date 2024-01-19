import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IParamConfigOptions, ProductItem } from '../../../types';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  productUserUrl: string = environment.products_user
  categoryUserUrl: string = environment.category_user
  configUrl: string = environment.config

  constructor(private http: HttpClient) { }

  getProduct(id: string) {
    return this.http.get<ProductItem>(`${this.productUserUrl}/${id}`)
  }

  getProductConfiguration(categoryId: string) {
    return this.http.get<any>(`${this.categoryUserUrl}/${categoryId}/config`)
  }

  getProductConfigItem(productId: string, configOptions: IParamConfigOptions) {
    const url = `${this.configUrl}/${productId}`;
    
    let params = new HttpParams();
    params = params.set('warranty', configOptions.warranty.toString());
    params = params.set('components', configOptions.components?.toString() || '');

    return this.http.get<any>(url, { params });
  }
}
