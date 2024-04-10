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
  AllOrders,
  Content,
  Notifications,
  Customers,
  Dashboard,
  ChartData,
  AllCategories,
  CancelShipment,
  AllCases,
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
    const query = JSON.parse(sessionStorage.getItem("search") || '')
    let params
    if (query) {
      params = { page, q: query, size: 9}
    } else {
      params = { page, size: 9}
    }
    return this.http.get<AllProducts>(
      `${this.baseUrl}/admin/product`, { params }
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

  getAttributes(page: number) {
    const query = JSON.parse(sessionStorage.getItem("search") || '')
    let params
    if (query) {
      params = { page, q: query, size: 9}
    } else {
      params = { page, size: 9}
    }
    return this.http.get<GetAttribute>(`${this.baseUrl}/admin/attributes`, { params });
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

  getCategoriesAndConfig(page: number) {
    const query = JSON.parse(sessionStorage.getItem("search") || '')
    const params = { page, q: query || '', size: 9}
    return this.http.get<AllCategories>(`${this.baseUrl}/admin/category/config`, { params })
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

  getCases(page: number) {
    const query = JSON.parse(sessionStorage.getItem("search") || '')
    let params
    if (query) {
      params = { page, q: query, size: 9}
    } else {
      params = { page, size: 9}
    }
    return this.http.get<AllCases>(`${this.baseUrl}/admin/cases`, { params })
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

  getAdminOrders(params?: Record<string, string | number>) {
    const query = JSON.parse(sessionStorage.getItem("search") || '')
    let newParams
    if (params) {
     newParams = { q: query || '', size: 9, page:0, ...params}
    }

    return this.http.get<AllOrders>(`${this.baseUrl}/admin/orders`, { params: newParams })
  }
  getUserOrders(params?: Record<string, string | number>) {
    return this.http.get<AllOrders>(`${this.baseUrl}/orders`, { params })
  }

  getOrder(id: string) {
    return this.http.get<Content>(`${this.baseUrl}/admin/orders/${id}`)
  }
  
  deleteAllAdminOrders(deleteList: string[]) {
    return this.http.delete(`${this.baseUrl}/admin/orders/all`, {
      body: deleteList
    })
  }

  getNotifications() {
    return this.http.get<Notifications>(`${this.baseUrl}/admin/notifications`)
  }

  getCustomers() {
    return this.http.get<Customers>(`${this.baseUrl}/admin/customers`)
  }

  getDashboardData() {
    return this.http.get<Dashboard>(`${this.baseUrl}/admin/dashboard`)
  }

  getChartData(params?: Record<string, string>) {
    return this.http.get<ChartData>(`${this.baseUrl}/admin/dashboard/revenue`, { params })
  }

  createShipment(id: string) {
    return this.http.post(`${this.baseUrl}/admin/shipment`, { id })
  }

  cancelShipment({ id, reason, status}: CancelShipment) {
    return this.http.patch(`${this.baseUrl}/admin/orders/${id}`, { reason, status })
  }

}
