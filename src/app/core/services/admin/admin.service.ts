import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import {
  AllProducts,
  Select,
  ProductItem,
  UploadResponse,
  BulkAttribute,
  GetAttribute,
  Configuration,
  CategoryAndConfig,
  ConfigurationEdit,
  EditConfigResponse,
  Case,
  CaseResponse,
  ProductPayload,
  BasicConfig,
  ProductResponse,
} from '../../../types';
import { CLOUD_NAME, NO_AUTH } from '../../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = environment.base_url;
  constructor(private http: HttpClient) {}

  getCategories() {
    return this.http.get<Select[]>(`${this.baseUrl}/admin/category`);
  }
  getBrands() {
    return this.http.get<Select[]>(`${this.baseUrl}/brand`);
  }

  addProduct(product: ProductPayload) {
    return this.http.post<ProductResponse>(`${this.baseUrl}/admin/product`, product);
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
    return this.http.get<BasicConfig>(`${this.baseUrl}/admin/category/${id}/config`);
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.baseUrl}/admin/product/${id}`);
  }

  updateProduct(id: string, product: ProductPayload) {
    return this.http.patch(`${this.baseUrl}/admin/product/${id}`, product);
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
    return this.http.get<GetAttribute>(`${this.baseUrl}/admin/attributes`);
  }

  uploadImage(params: FormData) {
    return this.http
      .post<UploadResponse>(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        params,
        { context: new HttpContext().set(NO_AUTH, true) }
      )
  }

  addAttribute(attribute: BulkAttribute) {
    return this.http.post<GetAttribute>(`${this.baseUrl}/admin/attributes/bulk`, attribute)
  }

  deleteAttributeOption(optionId: string, attributeId: string) {
    return this.http.delete(`${this.baseUrl}/admin/attributes/${attributeId}/options/${optionId}`)
  }
  deleteAttribute(attributeId: string) {
    return this.http.delete(`${this.baseUrl}/admin/attributes/${attributeId}`)
  }

  updateAttribute(attribute: BulkAttribute) {
    return this.http.put(`${this.baseUrl}/admin/attributes/bulk`, attribute)
  }

  deleteAll(deleteList: string[]) {    
    return this.http.delete(`${this.baseUrl}/admin/attributes/all`, {
      body: deleteList
    })
  }

  createCategoryConfig(categoryConfig: Configuration) {
    return this.http.post(`${this.baseUrl}/admin/category/config`, categoryConfig)
  }

  getCategoriesAndConfig() {
    return this.http.get<CategoryAndConfig[]>(`${this.baseUrl}/admin/category/config`)
  }

  getSingleCategory(id: string) {
    return this.http.get<EditConfigResponse>(`${ this.baseUrl }/admin/category/config/${id}`)
  }

  deleteCategories(deleteList: string[]) {
    return this.http.delete(`${this.baseUrl}/admin/category/config`, {
      body: deleteList
    })
  }

  editCategory(id: string, categoryConfig: ConfigurationEdit) {
    return this.http.put(`${this.baseUrl}/admin/category/config/${id}`, categoryConfig)
  }

  getCases() {
    return this.http.get<CaseResponse>(`${this.baseUrl}/admin/cases`)
  }

  getCase(id: string) {
    return this.http.get<Case>(`${this.baseUrl}/admin/cases/${id}`)
  }

  addCase({formData}: {formData: FormData}) {
    return this.http.post(`${this.baseUrl}/admin/cases`, formData)
  }
  
  updateCase({formData, id}: {formData: FormData, id: string}) {
    return this.http.put(`${this.baseUrl}/admin/cases/${id}`, formData)
  }

  deleteCase(id: string) {
    return this.http.delete(`${this.baseUrl}/admin/cases/${id}`)
  }

}
