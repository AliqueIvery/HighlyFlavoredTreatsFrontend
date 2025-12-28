import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TenantStripeSettings {
  tenantId: string;
  stripeAccountId?: string | null;
  chargesEnabled?: boolean | null;
  payoutsEnabled?: boolean | null;
  detailsSubmitted?: boolean | null;
  updatedAt?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TenantStripeSettingsService {
  private base = `${environment.apiBase}/api/admin/tenant/stripe`;

  constructor(private http: HttpClient) {}

  get(): Observable<TenantStripeSettings> {
    return this.http.get<TenantStripeSettings>(this.base);
  }

  saveAccountId(stripeAccountId: string): Observable<TenantStripeSettings> {
    return this.http.post<TenantStripeSettings>(`${this.base}/account-id`, { stripeAccountId });
  }
}
