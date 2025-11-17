// src/app/services/upload.service.ts
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface DirectUploadResponse {
  key: string;
  // url?: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly baseUrl = `${environment.apiBase}/api/uploads`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<DirectUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<DirectUploadResponse>(`${this.baseUrl}/image`, formData);
  }
}
