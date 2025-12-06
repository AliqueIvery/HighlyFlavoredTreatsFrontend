import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface OrderSuccessData {
  total: number;
  orderId?: string;
}

@Component({
  selector: 'app-order-success-dialog',
  templateUrl: './order-success-dialog.component.html',
  styleUrls: ['./order-success-dialog.component.css']
})
export class OrderSuccessDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: OrderSuccessData,
    private dialogRef: MatDialogRef<OrderSuccessDialogComponent>
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
