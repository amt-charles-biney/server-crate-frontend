import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductItem } from '../../../types';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeaturedProductService {

  featuredProductUrl: string = `${environment.base_url}`

  constructor(private http: HttpClient) { }

  getFeaturedProducts(): Observable<ProductItem[]> {
     return this.http.get<ProductItem[]>(`${this.featuredProductUrl}/featured`) 
  }

  getNewProducts(): Observable<ProductItem[]> {
    return this.http.get<ProductItem[]>(`${this.featuredProductUrl}/new`) 
 }

}

