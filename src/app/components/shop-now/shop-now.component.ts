// src/app/components/shop-now/shop-now.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-shop-now',
  templateUrl: './shop-now.component.html',
  styleUrls: ['./shop-now.component.css']
})
export class ShopNowComponent implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  // 🔑 key is now string because id is a string
  qtyMap: Record<string, number> = {};

  constructor(
    private productService: ProductService,
    private cart: CartService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        data.forEach(p => this.qtyMap[p.id] = 1);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load products right now.';
        this.loading = false;
      }
    });
  }

  addToCart(p: Product): void {
    const qty = this.qtyMap[p.id] ?? 1;
    this.cart.add(p, qty);
  }

  inc(p: Product): void {
    this.qtyMap[p.id] = (this.qtyMap[p.id] ?? 1) + 1;
  }

  dec(p: Product): void {
    const curr = this.qtyMap[p.id] ?? 1;
    this.qtyMap[p.id] = curr > 1 ? curr - 1 : 1;
  }

  get cartItems() {
    return this.cart.getItems();
  }

  get subtotal() {
    return this.cart.subtotal();
  }

  removeItem(id: string) {
    this.cart.remove(id);
  }

  get totalCartQty() {
    return this.cart.totalQuantity();
  }

  // trackBy can just return the string id
  trackById(index: number, p: Product): string {
    return p.id;
  }
}
