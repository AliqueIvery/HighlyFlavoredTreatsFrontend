import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  submitted = false;
  deliveryType = 'delivery';

  constructor(
    private fb: FormBuilder,
    public cart: CartService
  ) {}

  ngOnInit(): void {
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
  }

  get f() {
    return this.checkoutForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.checkoutForm.invalid) return;

    const order = {
      ...this.checkoutForm.value,
      items: this.cart.getItems(),
      total: this.cart.subtotal()
    };

    console.log('Order submitted:', order);
    alert('✅ Your order has been placed successfully! We’ll send a confirmation soon.');
    this.cart.clear();
    this.checkoutForm.reset();
    this.submitted = false;
  }

  changeDeliveryType(type: string): void {
    this.deliveryType = type;
    this.checkoutForm.patchValue({ deliveryType: type });
  }
}
