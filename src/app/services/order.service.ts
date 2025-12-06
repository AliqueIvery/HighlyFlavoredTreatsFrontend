import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Order, OrderStatus } from '../common/order';

export interface UpdateStatusRequest {
  status: OrderStatus;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = `${environment.apiBase}/api/orders`;

  constructor(private http: HttpClient) {}

  /** Get all orders for the current tenant (admin view) */
  getAll(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl);
  }

  /** Update status for one order */
  updateStatus(id: string, status: OrderStatus): Observable<Order> {
    const url = `${this.baseUrl}/${id}/status`;
    const body: UpdateStatusRequest = { status };
    return this.http.patch<Order>(url, body);
  }
}
