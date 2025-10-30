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

  qtyMap: Record<number, number> = {}; // productId -> qty

  constructor(
    private productService: ProductService,
    private cart: CartService
  ) {}

  // ngOnInit(): void {
  //   this.productService.getAll().subscribe({
  //     next: (data) => {
  //       this.products = data;
  //       // init qty
  //       data.forEach(p => this.qtyMap[p.id] = 1);
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.error = 'Unable to load products right now.';
  //       this.loading = false;
  //     }
  //   });
  // }

  ngOnInit(): void {
  // TEMPORARY PRODUCTS UNTIL BACKEND IS READY
  this.products = [
    {
      id: 1,
      name: 'Strawberry Cheesecake Cupcake',
      description: 'Moist vanilla cupcake topped with strawberry swirl cheesecake frosting.',
      price: 4.50,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    },
    {
      id: 2,
      name: 'Double Chocolate Brownie',
      description: 'Rich fudgy brownie made with premium cocoa and chocolate chunks.',
      price: 3.75,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    },
    {
      id: 3,
      name: 'Lemon Bliss Cookie',
      description: 'Soft lemon cookie with a zesty glaze and a sweet citrus bite.',
      price: 2.25,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    },
    {
      id: 4,
      name: 'Peach Cobbler Jar',
      description: 'Southern-style peach cobbler baked into a mason jar for ultimate freshness.',
      price: 7.00,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    },
    {
      id: 5,
      name: 'Red Velvet Slice',
      description: 'Classic red velvet cake with smooth cream cheese frosting — crowd favorite.',
      price: 5.00,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    },
    {
      id: 6,
      name: 'Banana Pudding Cup',
      description: 'Layers of fresh banana, vanilla wafers, and creamy pudding.',
      price: 6.50,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    },
    {
      id: 7,
      name: 'Cinnamon Roll Swirl',
      description: 'Freshly baked cinnamon roll topped with house-made vanilla icing.',
      price: 4.25,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    },
    {
      id: 8,
      name: 'Caramel Drizzle Cupcake',
      description: 'Soft butter cupcake with salted caramel drizzle and whipped frosting.',
      price: 4.50,
      imageUrl: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800&q=60'
    }
  ];

  // Initialize quantity map for cart use
  this.products.forEach(p => this.qtyMap[p.id] = 1);
  this.loading = false;
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

  removeItem(id: number) {
    this.cart.remove(id);
  }

  get totalCartQty() {
    return this.cart.totalQuantity();
  }
}
