import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../common/product';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiProduct } from '../common/dto/api-product';
import { mapApiProductToUi } from '../functions/map-api-product-to-ui';

export interface CreateProductRequest {
  title: string;
  priceCents: number;
  slug?: string | null;
  currency?: string | null;
  imageKey?: string | null;
  stock?: number | null;
  description: string | null;
}

export interface UpdateProductRequest extends CreateProductRequest {}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.apiBase}/api/products`; // move to environment

  constructor(private http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<ApiProduct[]>(this.baseUrl).pipe(
      map(apiProducts => apiProducts.map(mapApiProductToUi))
    );
  }

  getById(id: string): Observable<Product> {
    return this.http.get<ApiProduct>(`${this.baseUrl}/${id}`).pipe(
      map(mapApiProductToUi)
    );
  }

  update(id: string, body: UpdateProductRequest): Observable<Product> {
    return this.http.put<ApiProduct>(`${this.baseUrl}/${id}`, body).pipe(
      map(mapApiProductToUi)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  create(req: CreateProductRequest): Observable<Product> {
    return this.http.post<ApiProduct>(this.baseUrl, req).pipe(
      map(mapApiProductToUi)
    );
  }
}
