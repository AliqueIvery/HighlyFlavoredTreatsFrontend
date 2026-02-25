import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface CheckoutItem {
  productId: string;
  quantity: number;
}

export interface CreateIntentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryType: string;
  tipAmount?: number;
  items: CheckoutItem[];
}

export interface CreateIntentResponse {
  clientSecret: string;
  orderId?: string;
}

export interface ConfirmPaymentRequest {
  orderId: number;
  paymentIntentId: string;
}

export interface ConfirmPaymentResponse {
  orderId: string;
  status: string;
  alreadyPaid: boolean;
  emailsSent: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(private http: HttpClient) {}

  /** Calls backend to create Stripe PaymentIntent + draft order */
  createPaymentIntent(body: CreateIntentRequest) {
    return this.http.post<CreateIntentResponse>(
      `${environment.apiBase}/api/payments/create-intent`,
      body
    );
  }

  confirmPayment(body: ConfirmPaymentRequest) {
    return this.http.post<ConfirmPaymentResponse>(
      `${environment.apiBase}/api/payments/confirm`,
      body
    );
  }
}
