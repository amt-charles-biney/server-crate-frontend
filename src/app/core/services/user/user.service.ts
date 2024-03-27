import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AllProducts, Comparison, Comparisons, IParamConfigOptions, PageAbleResponseData, Product, ProductItemSubset, Select, SingleProductResponse, Wishlist } from '../../../types';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.base_url
  constructor(private http: HttpClient) { }

  getProducts(page: number, filterParams: Record<string, string>) {
    return this.http.get<AllProducts>(`${this.baseUrl}/product`, { params: filterParams})
  }

  getCategories() {
    return this.http.get<Select[]>(`${this.baseUrl}/category`)
  }

  getBrands() {
    return this.http.get<Select[]>(`${this.baseUrl}/brand`)
  }
  
  getCategoryConfiguration(id: string) {
    return this.http.get(`${this.baseUrl}/category/${id}/config`)
  }

  getSearchResults(searchValue: string) {
    return this.http.get<AllProducts>(`${this.baseUrl}/search/products?query=${searchValue}`)
  }

  getCases(): Observable<PageAbleResponseData<Select>> {
    return this.http.get<PageAbleResponseData<Select>>(`${this.baseUrl}/cases`);
  }

  getRecommendations() {
    return this.http.get<ProductItemSubset[]>(`${this.baseUrl}/recommendation`)
  }

  getWishlist() {
    return this.http.get<Wishlist>(`${this.baseUrl}/wishlists`)
  }

  addToWishlist(id: string, configOptions: IParamConfigOptions ) {
    let params = new HttpParams()
    params = params.set('warranty', configOptions.warranty.toString())
    params = params.set('components', configOptions.components?.toString() ?? '')
    return this.http.post(`${this.baseUrl}/wishlists/add-item/${id}`, configOptions, { params })
  }

  removeFromWishlist(id: string) {
    return this.http.delete(`${this.baseUrl}/wishlists/${id}`)
  }

  getComparisons() {
    let params = ''
    if (localStorage.getItem("products")) {
      const listOfIds: string[] = Object.keys(JSON.parse(localStorage.getItem("products")!))
      params = listOfIds.join(',')
    }
    console.log('Params', params);
    
    return this.http.get<Comparisons>(`${this.baseUrl}/compare/all?products=${params}`)
  }

  getAllProducts() {
    return this.http.get<{data: Product[], message: string, status: string}>(`${this.baseUrl}/compare`)
  }

  getSingleProduct(id: string) {
    return this.http.get<SingleProductResponse>(`${this.baseUrl}/compare/${id}`)
  }
}
