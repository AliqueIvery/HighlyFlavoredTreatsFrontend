// src/app/services/upload.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

interface PresignResponse {
  key: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly baseUrl = `${environment.apiBase}/api/uploads`;

  constructor(private http: HttpClient) {}

  async uploadImagePresigned(file: File): Promise<{ key: string }> {
    // 1) Ask backend for presigned URL
    const presign = await firstValueFrom(
      this.http.post<PresignResponse>(`${this.baseUrl}/presign-image`, {
        fileName: file.name,
        contentType: file.type || 'application/octet-stream'
      })
    );

    // 2) Upload file directly to S3
    await firstValueFrom(
      this.http.put(presign.url, file, {
        headers: {
          'Content-Type': file.type || 'application/octet-stream'
        }
      })
    );

    return { key: presign.key };
  }
}
