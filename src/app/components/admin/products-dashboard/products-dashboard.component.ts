// src/app/components/admin/products-dashboard/products-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products-dashboard',
  templateUrl: './products-dashboard.component.html',
  styleUrls: ['./products-dashboard.component.css']
})
export class ProductsDashboardComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;

  // 🔥 use string, not number
  deletingId: string | null = null;

  constructor(
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load products.';
        this.loading = false;
      }
    });
  }

  deleteProduct(p: Product): void {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) {
      return;
    }

    this.deletingId = p.id; // p.id is now string

    this.productService.delete(p.id).subscribe({
      next: () => {
        this.products = this.products.filter(prod => prod.id !== p.id);
        this.deletingId = null;
      },
      error: (err) => {
        console.error(err);
        this.deletingId = null;
        alert('Failed to delete product.');
      }
    });
  }

  trackById(index: number, p: Product): string {
    return p.id;
  }
}
