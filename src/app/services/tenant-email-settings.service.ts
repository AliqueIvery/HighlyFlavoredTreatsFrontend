import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export type EmailVerifyStatus = 'PENDING' | 'VERIFIED' | 'FAILED';

export interface EmailDnsRecord {
  type: 'TXT' | 'CNAME';
  name: string;
  value: string;
}

export interface TenantEmailSettings {
  fromName: string | null;
  fromEmail: string;
  domain: string;
  status: EmailVerifyStatus;
  dnsRecords: EmailDnsRecord[];
  verifiedAt?: string | null;
}

export interface SaveEmailSettingsRequest {
  fromName?: string | null;
  fromEmail: string; // e.g. orders@highlyflavoredtreats.com
}

@Injectable({ providedIn: 'root' })
export class TenantEmailSettingsService {
  private base = `${environment.apiBase}/api/admin/email-settings`;

  constructor(private http: HttpClient) {}

  get(): Observable<TenantEmailSettings> {
    return this.http.get<TenantEmailSettings>(this.base);
  }

  save(body: SaveEmailSettingsRequest): Observable<TenantEmailSettings> {
    return this.http.put<TenantEmailSettings>(this.base, body);
  }

  verify(): Observable<TenantEmailSettings> {
    return this.http.post<TenantEmailSettings>(`${this.base}/verify`, {});
  }

  getDns() {
  return this.http.get<any[]>(`${this.base}/dns`);
}

generateDns() {
  return this.http.post<any[]>(`${this.base}/dns/generate`, {});
}

}
