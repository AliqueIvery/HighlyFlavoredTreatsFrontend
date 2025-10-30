import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartItem[] = [];

  getItems(): CartItem[] {
    return this.items;
  }

  add(product: Product, qty: number = 1): void {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantity += qty;
    } else {
      this.items.push({ product, quantity: qty });
    }
  }

  remove(productId: number): void {
    this.items = this.items.filter(i => i.product.id !== productId);
  }

  clear(): void {
    this.items = [];
  }

  subtotal(): number {
    return this.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
