import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class TenantInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // however you store it (localStorage, resolver, config, etc.)
    const tenantId = environment.tenantId; // e.g. "tnt_hft001"
    if (!tenantId) return next.handle(req);

    // only attach to your API domain
    if (!req.url.includes('/api/')) return next.handle(req);

    return next.handle(req.clone({
      setHeaders: { 'X-Tenant-Id': tenantId }
    }));
  }
}
