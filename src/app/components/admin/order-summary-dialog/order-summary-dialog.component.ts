import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService, OrderDetailsDto } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-summary-dialog',
  templateUrl: './order-summary-dialog.component.html',
  styleUrls: ['./order-summary-dialog.component.css']
})
export class OrderSummaryDialogComponent {
  loading = true;
  error: string | null = null;
  order: OrderDetailsDto | null = null;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { orderId: string | number },
    private dialogRef: MatDialogRef<OrderSummaryDialogComponent>,
    private orderService: OrderService
  ) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;

    this.orderService.getById(this.data.orderId).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load order summary.';
        this.loading = false;
      }
    });
  }

  close() {
    this.dialogRef.close();
  }

  formatMoney(cents?: number) {
    const v = (cents ?? 0) / 100;
    return v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  }

  formatDate(iso?: string) {
    if (!iso) return '';
    return new Date(iso).toLocaleString();
  }
}
