// src/app/services/cart.service.ts
import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'hft_cart';
  private items: CartItem[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) {
        this.items = [];
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        this.items = parsed;
      } else {
        this.items = [];
      }
    } catch (err) {
      console.error('Failed to parse cart from localStorage', err);
      this.items = [];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }

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
    this.saveToStorage();
  }

  // 🔑 use string id
  remove(productId: string): void {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.saveToStorage();
  }

  clear(): void {
    this.items = [];
    this.saveToStorage();
  }

  subtotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  totalQuantity(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}
