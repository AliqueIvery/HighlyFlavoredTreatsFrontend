import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

export interface ContactUsRequest {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactUsService {
  private base = `${environment.apiBase}/api/public/contact`;

  constructor(private http: HttpClient) {}

  sendMessage(body: ContactUsRequest): Observable<void> {
    return this.http.post<void>(this.base, body);
  }
}
