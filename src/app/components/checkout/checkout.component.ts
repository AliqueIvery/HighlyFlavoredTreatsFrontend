// src/app/components/checkout/checkout.component.ts
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { firstValueFrom } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environment';
import { CheckoutService } from 'src/app/services/checkout.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OrderSuccessDialogComponent } from '../order-success-dialog/order-success-dialog.component';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild('cardElement', { static: false })
  cardElement!: ElementRef<HTMLDivElement>;

  checkoutForm!: FormGroup;
  submitted = false;
  deliveryType = 'delivery';

  stripe: Stripe | null = null;
  card!: StripeCardElement;

  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    public cart: CartService,
    private dialog: MatDialog,
    private router: Router,
    public checkoutService: CheckoutService
  ) {}

  async ngOnInit(): Promise<void> {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      postalCode: ['', Validators.required],
      deliveryType: ['delivery', Validators.required]
    });

    // Pre-load Stripe (but we’ll also guard in setupCardElement)
    this.stripe = await loadStripe(environment.stripe.publishableKey);
    if (!this.stripe) {
      console.error('❌ Stripe failed to initialize. Check publishable key.');
      this.error = 'Payment system is temporarily unavailable.';
    }
  }

  ngAfterViewInit(): void {
    this.setupCardElement();
  }

  private async setupCardElement() {
    // Ensure Stripe is loaded
    if (!this.stripe) {
      this.stripe = await loadStripe(environment.stripe.publishableKey);
      if (!this.stripe) {
        console.error('❌ Stripe still not available in setupCardElement().');
        return;
      }
    }

    if (!this.cardElement) {
      console.error('❌ cardElement ViewChild is not available.');
      return;
    }

    // Avoid remounting if card already exists
    if (this.card) {
      return;
    }

    const elements = this.stripe.elements();

    this.card = elements.create('card', {
      style: {
        base: {
          color: '#ffffff',       // card numbers, text, CVV
          iconColor: '#ffffff',
          fontSize: '16px',
          '::placeholder': {
            color: '#cccccc'      // light gray placeholder
          },
        },
        invalid: {
          color: '#ff4d4f',
          iconColor: '#ff4d4f'
        }
      }
    });

    this.card.mount(this.cardElement.nativeElement);
    console.log('✅ Stripe Card Element mounted');
  }

  get f() {
    return this.checkoutForm.controls;
  }

  changeDeliveryType(type: string): void {
    this.deliveryType = type;
    this.checkoutForm.patchValue({ deliveryType: type });
  }

  // 🔹 Cart helpers for template
  get cartItems(): CartItem[] {
    return this.cart.getItems();
  }

  get subtotal(): number {
    return this.cart.subtotal();
  }

  // 🔥 Same fee model as backend: Stripe 2.9% + $0.30 + 7% platform
  get processingFee(): number {
    if (!this.subtotal) return 0;

    const STRIPE_PERCENT = 0.029;
    const PLATFORM_PERCENT = 0.07;
    const FIXED_FEE_CENTS = 30;

    const S = Math.round(this.subtotal * 100); // subtotal in cents

    const gross = (S + FIXED_FEE_CENTS) / (1 - STRIPE_PERCENT - PLATFORM_PERCENT);
    const feeCents = Math.round(gross - S);

    return feeCents / 100;
  }

  get totalWithFees(): number {
    return this.subtotal + this.processingFee;
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;
    this.error = null;

    if (this.checkoutForm.invalid) return;
    if (!this.stripe || !this.card) {
      this.error = 'Payment system is not ready. Please refresh.';
      return;
    }

    const cartItems = this.cart.getItems();
    if (!cartItems.length) {
      this.error = 'Your cart is empty.';
      return;
    }

    this.loading = true;

    try {
      const formValue = this.checkoutForm.value;

      const checkoutBody = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        address: formValue.address,
        city: formValue.city,
        state: formValue.state,
        postalCode: formValue.postalCode,
        deliveryType: formValue.deliveryType,
        items: cartItems.map(ci => ({
          productId: ci.product.id,
          quantity: ci.quantity
        }))
        // ❌ No amountCents here – backend recomputes from DB and applies fees
      };

      const res = await firstValueFrom(
        this.checkoutService.createPaymentIntent(checkoutBody)
      );

      const clientSecret = res?.clientSecret;
      const orderId = (res as any)?.orderId;
      console.log('Created order:', orderId);

      if (!clientSecret) {
        this.error = 'Backend returned no client secret.';
        this.loading = false;
        return;
      }

      const { error, paymentIntent } = await this.stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: this.card,
            billing_details: {
              name: `${formValue.firstName} ${formValue.lastName}`,
              email: formValue.email,
              phone: formValue.phone
            }
          }
        }
      );

      if (error) {
        console.error(error);
        this.error = error.message || 'Payment failed.';
      } else if (paymentIntent?.status === 'succeeded') {
        // Use totalWithFees to show what customer actually paid
        const finalTotal = this.totalWithFees;

        // Clear cart + reset form
        this.cart.clear();
        this.checkoutForm.reset({ deliveryType: 'delivery' });
        this.submitted = false;

        // Open success dialog
        const dialogRef = this.dialog.open(OrderSuccessDialogComponent, {
          width: '360px',
          data: {
            total: finalTotal,
            orderId: orderId
          }
        });

        // When dialog closes, go home
        dialogRef.afterClosed().subscribe(() => {
          this.router.navigate(['/']);
        });
      } else {
        this.error = 'Payment status unknown. Please contact us.';
      }
    } catch (err) {
      console.error(err);
      this.error = 'Something went wrong while processing your order.';
    } finally {
      this.loading = false;
    }
  }
}
