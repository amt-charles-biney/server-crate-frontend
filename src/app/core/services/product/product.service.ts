import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IParamConfigOptions, ProductItem } from '../../../types';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

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

  getProductConfigItem (productId: string, configOptions: IParamConfigOptions): Observable<any> {
    const url = `${this.base_url}/config/${productId}`

    let params = new HttpParams()
    params = params.set('warranty', configOptions.warranty.toString())
    params = params.set('components', configOptions.components?.toString() ?? '')

    return this.http.get<any>(url, { params })
  }

  addProductToCart (productId: string, configOptions: IParamConfigOptions): Observable<any> {
    const url = `${this.base_url}/carts/add-item/${productId}`

    let params = new HttpParams()
    params = params.set('warranty', configOptions.warranty.toString())
    params = params.set('components', configOptions.components ?? '')

    return this.http.post<any>(url, { params })
  }
}
