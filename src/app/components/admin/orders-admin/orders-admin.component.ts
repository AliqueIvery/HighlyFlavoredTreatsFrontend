import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order, OrderStatus } from 'src/app/common/order';
import { OrderService } from 'src/app/services/order.service';
import { OrderSummaryDialogComponent } from '../order-summary-dialog/order-summary-dialog.component';

@Component({
  selector: 'app-orders-admin',
  templateUrl: './orders-admin.component.html',
  styleUrls: ['./orders-admin.component.css']
})
export class OrdersAdminComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error: string | null = null;

  updating: Set<string> = new Set();

  // Backend statuses
  statusOptions: OrderStatus[] = [
    'PENDING',
    'PAID',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  ];

  constructor(private orderService: OrderService,
              private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;

    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load orders.';
        this.loading = false;
      }
    });
  }

  onStatusChange(order: Order, newStatus: OrderStatus) {
    if (newStatus === order.status) return;

    this.updating.add(order.id);

    this.orderService
      .updateStatus(order.id, newStatus)
      .subscribe({
        next: (updated) => {
          const idx = this.orders.findIndex((o) => o.id === updated.id);
          if (idx !== -1) this.orders[idx] = updated;
          this.updating.delete(order.id);
        },
        error: () => {
          alert('Failed to update order status.');
          this.updating.delete(order.id);
        }
      });
  }

  formatDate(iso: string) {
    return new Date(iso).toLocaleString();
  }

  trackById(index: number, order: Order) {
    return order.id;
  }

  formatMoney(cents: number | null | undefined): string {
    if (cents == null) return '$0.00';
    return (cents / 100).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }

  netToMerchant(o: Order): number {
    const base =
      (o.subtotalCents || 0) +
      (o.shippingCents || 0) +
      (o.taxCents || 0);
    return base;
  }

  openOrderSummary(orderId: string | number) {
    this.dialog.open(OrderSummaryDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: { orderId }
    });
  }
}
