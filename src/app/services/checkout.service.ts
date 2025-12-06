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
  items: CheckoutItem[];
}

export interface CreateIntentResponse {
  clientSecret: string;
  orderId?: string;
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
}
