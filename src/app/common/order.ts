export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  tenantId?: string;
  deliveryType?: string | null;
  status: OrderStatus;
  deliveryEligible: boolean;

  customerName: string;
  customerEmail: string;

  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;

  latitude?: number;
  longitude?: number;

  subtotalCents: number;
  tipAmountCents?: number | null;
  shippingCents: number;
  taxCents: number;
  grandTotalCents: number;

  createdAt: string; // ISO datetime string

  processingFeeCents?: number | null
}
