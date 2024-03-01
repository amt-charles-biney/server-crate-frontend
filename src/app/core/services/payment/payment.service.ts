import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PaymentRequest, PaymentResponse, PaymentVerification } from '../../../types';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  base_url = environment.base_url
  constructor(private http: HttpClient) { }

  postPayment(paymentRequest: PaymentRequest) {
    return this.http.post<PaymentResponse>(`${this.base_url}/payment`, paymentRequest)
  }

  verifyPayment(reference: string) {
    return this.http.get<PaymentVerification>(`${this.base_url}/payment/${reference}`)
  }
}
