import { HttpClient } from '@angular/common/http';
import { getCategories } from './../../../store/admin/products/categories.actions';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { DummyCategory } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  url = environment.dummy
  constructor(private http: HttpClient) {

   }

  getCategories() {
    return this.http.get<DummyCategory[]>(this.url)
  }
}
