import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../common/order';

export interface UpdateStatusRequest {
  status: OrderStatus;
}

export interface OrderItemDto {
  id?: string;
  productId?: string;
  productName: string;
  quantity: number;
  unitPriceCents: number;
  lineTotalCents: number;
}

export interface OrderDetailsDto {
  order: {
    id: string;
    tenantId?: string;
    status: string;
    createdAt?: string;

    customerName?: string;
    customerEmail?: string;

    addressLine1?: string;
    city?: string;
    state?: string;
    postalCode?: string;

    deliveryType?: string;
    deliveryEligible?: boolean;

    subtotalCents?: number;
    shippingCents?: number;
    taxCents?: number;
    processingFeeCents?: number;
    grandTotalCents?: number;
  };
  items: OrderItemDto[];
}





/** Optional: add internal note */
export interface AddInternalNoteRequest {
  text: string;
}

/** Optional: record manual payment (cash/zelle/etc.) */
export interface RecordManualPaymentRequest {
  amountCents: number;
  method: 'CASH' | 'ZELLE' | 'CASHAPP' | 'OTHER';
  reference?: string;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = `${environment.apiBase}/api/orders`;

  constructor(private http: HttpClient) {}

  /** Get all orders for the current tenant (admin view) */
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /** Get one order with full details for the summary view */
  getById(id: string | number): Observable<OrderDetailsDto> {
    return this.http.get<OrderDetailsDto>(`${this.baseUrl}/${id}`);
  }

  /** Update status for one order */
  updateStatus(id: string | number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.baseUrl}/${id}/status`, { status });
  }

  // -----------------------------
  // Optional admin actions (only if your backend supports them)
  // -----------------------------

  /** Add an internal note (admin-only) */
  addInternalNote(id: string | number, text: string): Observable<OrderDetailsDto> {
    return this.http.post<OrderDetailsDto>(`${this.baseUrl}/${id}/notes/internal`, { text });
  }

  /** Resend receipt/confirmation email */
  resendReceipt(id: string | number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/receipt/resend`, {});
  }

  /** Record a manual payment (cash, etc.) */
  recordManualPayment(id: string | number, req: RecordManualPaymentRequest): Observable<OrderDetailsDto> {
    return this.http.post<OrderDetailsDto>(`${this.baseUrl}/${id}/payments/manual`, req);
  }
}
